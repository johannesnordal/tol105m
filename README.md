# LAMEC

The **LAMEC** API (**L**oad **A**I **M**odules, **E**nvironments, and **C**ontainers)
is a tool that allows HPC developers and researchers to share their configurations,
setups and jobscripts of commonly used frameworks and libraries, so they can be
used to generate up to date jobscripts.

Check out our
[website](https://apps.fz-juelich.de/jsc/lamec/index.php)
to see what systems and software are available.
If you want to contribute or learn about the structure of our project, please
read our
[wiki](https://gitlab.jsc.fz-juelich.de/CoE-RAISE/FZJ/lamec-oa/-/wikis/LAMEC-Project-Overview).

## Build and Run

To build LAMEC, run:

```
python3 lamec.py build
```

This command creates `form-schema.json` that is used for input control
for the front-end. 

You can test LAMEC locally using the built-in PHP web server:

```
php -S localhost:<port>
```
