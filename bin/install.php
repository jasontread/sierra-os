<?php
$d = dirname(dirname(__FILE__));
exec("mkdir -p $d/etc/plugins");
exec("chmod 777 $d/etc/plugins");
exec("mkdir -p $d/lib/model");
exec("chmod 777 $d/lib/model");
exec("mkdir -p $d/lib/plugins");
exec("chmod 777 $d/lib/plugins");
exec("mkdir -p $d/www/html/plugins");
exec("chmod 777 $d/www/html/plugins");
exec("mkdir -p $d/www/tpl/plugins");
exec("chmod 777 $d/www/tpl/plugins");
if (file_exists("$d/etc/app-config-default.xml")) {
  exec("rm -f $d/etc/app-config.xml");
  exec("cp $d/etc/app-config-default.xml $d/etc/app-config.xml");
}
if (file_exists("$d/etc/l10n/custom.properties.example")) {
  exec("rm -f $d/etc/l10n/custom.properties");
  exec("cp $d/etc/l10n/custom.properties.example $d/etc/l10n/custom.properties");
}
exec("rm -f /var/www/sierra/tmp/.var.www.sierra.app.sraos.etc.app-config.xml1.php");
?>
