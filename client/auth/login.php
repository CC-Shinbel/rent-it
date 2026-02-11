<?php
session_start();
include '../../shared/php/db_connection.php';

// Legacy client login UI has been moved to the React app (/login route).
// This file now simply redirects old links to the new React login page.

header('Location: /rent-it/frontend/index.html#/login');
exit;
