<?php

require_once('_includes/main.php');

header("Content-type: application/opensearchdescription+xml");

echo '<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <Image height="16" width="16" type="image/x-icon">' . WEB_ROOT . 'favicon.ico</Image>
  <ShortName>' . TITLE . '</ShortName>
  <Description>' . INTROLINE . '</Description>
  <Url type="text/html" template="' . WEB_ROOT . '?q={searchTerms}"/>
</OpenSearchDescription>';

?>