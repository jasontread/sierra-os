# sierra-os Installation
Prior to installing sierra-os, you MUST install the [sierra-php](https://github.com/jasontread/sierra-php) framework.

1. `cd /path/to/sierra-php/app/`
2. `git clone https://github.com/jasontread/sierra-os.git`
3. `mv sierra-os sraos`
4. `php sraos/bin/install.php`
4. proceed to "Setup instructions" below

## Setup Instructions
These instructions should only be completed once you have installed sierra-os using one of the 3 methods described above.

### ImageMagick
[ImageMagick](http://www.imagemagick.org) is required for image manipulation used by sierra-os. Installing may be as easy as yum install ImageMagick. If you are installing using the RPM, ImageMagick is defined as a depedency.

### Configure PHP
The following configuration settings are recommended for PHP:

  * `max_execution_time = 120`
  * `memory_limit = 64M`
  * `upload_max_filesize = 8M`
  * `magic_quotes_gpc = Off`
  * `magic_quotes_runtime = Off`
  * `post_max_size = 16M`
  
### MySQL
The following configuration settings are recommend for MySQL:

  * `max_allowed_packet = 32M`
  
Create MySQL database instance (if you have not already done so):

  * ` mysql < /path/to/sierra-php/app/sraos/etc/mysql-create-database`
  
#### Add Database Instance to App Configuration

1. Open `/path/to/sierra-php/app/sraos/etc/app-config.xml`
2. Locate the `db key="sraos"` element and replace the corresponding attributes as necessary (`key` is the name of the database)

NOTES

1. The default `host` is `localhost` so you can remove that attribute if that is your db host.
2. If you used the `/path/to/sierra-php/app/sraos/etc/mysql-create-database` script in the previous section, you should not need to modify any of the database configuration settings

### Initialize App

1. `/path/to/sierra-php/bin/sra-quick-install.php sierra-os`
2. Look for any errors that were output at the command line or in the log file (`/path/to/sierra-php/log/`)

### Configure Apache
 If you have the ability to restart Apache (preferrred), follow these directions:
 
 1. `/path/to/sierra-php/bin/sra-installer.php`
 2. Select menu options: `Configure application > Configure existing applications > sierra-os > Configure Apache`
 3. Provide your desired Apache configuration settings for sierra-os
 4. Restart Apache
 
 NOTE: The alias for `model/sra-ws-gateway.php` MUST be `ws` AND the alias for `model/sra-file-renderer.php` MUST be `files` AND the Apache rewrite rule for your files alias MUST be enabled. If you use different aliases, you must update the `ws-gateway-uri`, `ws-gateway-rewrite`, `file-script-uri` and `file-script-rewrite` attributes in `/path/to/sierra-php/app/sraos/etc/app-model.xml`
 
### Update Application Name
 
 1. Open `/path/to/sierra-php/app/sraos/etc/l10n/custom.properties`
 2. Add 2 entries:
     * `[appid]=[the name of your application]`
     * `[appid.short]=[the abbreviation your application]`
     
### Login and Reset Default Password

1. Go to: http://[url/to/sraos]
2. The initial username/password is: `root/root`
3. Click on the user menu (the blue icon in the upper left corner)
    * Settings => Click Account Settings
    * Update your name and email address and change your password
