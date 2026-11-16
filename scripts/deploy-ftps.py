"""Upload a static export over verified FTPS, retrying interrupted connections."""
import ftplib
import os
from pathlib import Path
import ssl
import time


def connect():
    ftp = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=90)
    try:
        ftp.connect(os.environ["FTP_HOST"], 21)
        ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASSWORD"])
        ftp.prot_p()
        ftp.cwd(os.environ["FTP_REMOTE_DIR"])
        return ftp, ftp.pwd()
    except Exception:
        ftp.close()
        raise


def main():
    required = ("FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_DIR")
    if any(not os.environ.get(name) for name in required):
        raise SystemExit("Set all four FTP repository secrets before enabling deployment.")
    output = Path("out")
    if not (output / ".htaccess").is_file() or not (output / "hy/index.html").is_file():
        raise SystemExit("Static build is missing; refusing to upload.")
    paths = sorted((p for p in output.rglob("*") if p.is_file()),
                   key=lambda p: (p.suffix == ".html" or p.name == ".htaccess", str(p)))
    ftp = None
    current_parent = None
    directories = {"."}
    try:
        for index, path in enumerate(paths, 1):
            relative = path.relative_to(output)
            parent = relative.parent.as_posix()
            for attempt in range(5):
                try:
                    if ftp is None:
                        ftp, destination = connect()
                        current_parent = None
                        print("Connected over verified FTPS.", flush=True)
                    if current_parent != parent:
                        ftp.cwd(destination)
                        if parent not in directories:
                            for part in relative.parent.parts:
                                try:
                                    ftp.cwd(part)
                                except ftplib.error_perm:
                                    ftp.mkd(part)
                                    ftp.cwd(part)
                            directories.add(parent)
                        elif parent != ".":
                            ftp.cwd(parent)
                        current_parent = parent
                    with path.open("rb") as source:
                        ftp.storbinary("STOR " + relative.name, source, blocksize=262144)
                    break
                except (EOFError, OSError, ftplib.error_temp) as error:
                    if ftp is not None:
                        ftp.close()
                        ftp = None
                    if attempt == 4:
                        raise
                    print(f"Connection interrupted ({type(error).__name__}); retry {attempt + 1}/4 at file {index}.", flush=True)
                    time.sleep(min(2 ** attempt, 8))
            if index == 1 or index % 250 == 0:
                print(f"Uploaded {index}/{len(paths)} static files.", flush=True)
        print(f"Uploaded {len(paths)} static files successfully.", flush=True)
    finally:
        if ftp is not None:
            ftp.close()


if __name__ == "__main__":
    main()
