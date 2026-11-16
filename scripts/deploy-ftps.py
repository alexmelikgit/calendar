"""Upload only the static output to a dedicated subdomain FTP account.

Requires explicit FTPS on port 21 with a valid server certificate.
Never removes remote files. Upload HTML last so assets arrive first.
"""
import ftplib
import os
from pathlib import Path
import ssl


def main():
    required = ("FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_DIR")
    if any(not os.environ.get(name) for name in required):
        raise SystemExit("Set all four FTP repository secrets before enabling deployment.")
    output = Path("out")
    if not (output / ".htaccess").is_file() or not (output / "hy/index.html").is_file():
        raise SystemExit("Static build is missing; refusing to upload.")

    with ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=60) as ftp:
        ftp.connect(os.environ["FTP_HOST"], 21)
        ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASSWORD"])
        ftp.prot_p()
        ftp.cwd(os.environ["FTP_REMOTE_DIR"])
        destination = ftp.pwd()
        directories = {"."}
        paths = sorted((p for p in output.rglob("*") if p.is_file()),
                       key=lambda p: (p.suffix == ".html" or p.name == ".htaccess", str(p)))
        for path in paths:
            relative = path.relative_to(output)
            parent = relative.parent.as_posix()
            if parent not in directories:
                ftp.cwd(destination)
                for part in relative.parent.parts:
                    try:
                        ftp.cwd(part)
                    except ftplib.error_perm:
                        ftp.mkd(part)
                        ftp.cwd(part)
                directories.add(parent)
            else:
                ftp.cwd(destination)
                if parent != ".":
                    ftp.cwd(parent)
            with path.open("rb") as source:
                ftp.storbinary("STOR " + relative.name, source, blocksize=262144)
        print(f"Uploaded {len(paths)} static files successfully.")


if __name__ == "__main__":
    main()
