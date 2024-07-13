<?php
header('Content-type: text/xml');
echo file_get_contents('https://api.classement.ikilote.net/sitemap.xml');
