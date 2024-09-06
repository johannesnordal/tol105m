<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <!-- LOAD Highlight CSS -->
        <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css">

        <!-- LOAD Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
              crossorigin="anonymous">

        <?php if ($active == 'status'): ?>
        <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
              crossorigin="anonymous">
        <?php endif; ?>

        <style>
            .h-color {
                color: rgb(4,132,196);
            }
            .w-980p {
                max-width: 980px;
            }
            #jobscript-output {
                font-family: monospace, monospace;
            }
        </style>

        <?php if ($active == 'form' || $active == 'status'): ?>
        <!-- LOAD jQuery -->
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"
                integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
                crossorigin="anonymous">
        </script>
        <?php endif; ?>

        <!-- LOAD Popper -->
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
                integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
                crossorigin="anonymous">
        </script>

        <!-- LOAD Bootstrap JS -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
                integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
                crossorigin="anonymous">
        </script>

        <!-- LOAD Hightlight JS -->
        <!-- Include the Highlight.js library -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        <!-- Initialize Highlight.js -->
        <script>hljs.highlightAll();</script>

        <?php if ($active == 'form'): ?>
        <script src="js/form.js"></script>
        <?php endif; ?>

        <?php if ($active == 'status'): ?>
        <script src="js/status.js"></script>
        <?php endif; ?>

    </head>

    <body class="d-flex flex-column min-vh-100">

        <!-- BEGIN Header -->
        <header>

            <!-- BEGIN Logo -->
            <div class="container text-center mt-4 mb-4">
                <a href="https://www.coe-raise.eu" target="_blank">
                    <img src="images/logo.png"
                         height="160"
                         alt="Raise Logo"
                         loading="lazy">
                </a>
            </div>
            <!-- END Logo -->

            <!-- BEGIN Navigation Bar -->
            <nav class="navbar navbar-light navbar-expand-sm navbar-light bg-light">
                <div class="container justify-content-center w-980p">
                    <!--
                    <a href="about.php" class="navbar-brand h-color">
                        LAMEC
                    </a>
                    -->
                    <button class="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarNav"
                            aria-controls="navbarNav"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse flex-grow-0" id="navbarNav">
                        <ul class="navbar-nav"> 
                            <li class="nav-item">
                                <a href="about.php"
                                   class="nav-link <?php echo ($active == 'about' ? 'active' : ''); ?>">
                                    <!-- Home -->
                                    Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="index.php"
                                   class="nav-link <?php echo ($active == 'form' ? 'active' : ''); ?>">
                                    Jobscript Generator
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="status.php"
                                   class="nav-link <?php echo ($active == 'status' ? 'active' : ''); ?>">
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <!-- END Navigation Bar -->

        </header>
        <!-- END Header -->

        <!-- BEGIN Main Section -->
        <main id="main-section" class="container my-4 w-980p">
            <?php echo $content ?>
        </main>
        <!-- END Main Section -->

        <!-- BEGIN Footer -->
        <footer class="mt-auto py-3 bg-light">
            <div class="container text-center justify-content-center w-980p">
                <span class="text-body-secondary">
                    <div class="py-3">
                        The
                        <a href="https://www.coe-raise.eu" target"_blank">
                            CoE RAISE project
                        </a>
                        has received funding from the European Union’s Horizon 2020 – Research and Innovation Framework Programme H2020-INFRAEDI-2019-1 under grant agreement no. 951733</div>
                    <div class="py-2">&copy;2021 CoE RAISE.</div>
                </span>
            </div>
        </footer>
        <!-- END Footer -->

    </body>
</html>
