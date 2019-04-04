# sierra-os productivity plugin
The productivity plugin currently provides the MyProjects application and may be used in the future to provide additional productivity related applications.

## Install wget
If you have not already done so, please install [wget](https://www.gnu.org/software/wget/). this can be as easy as `yum install wget`

## Email configuration
In order to utilize the email based messaging provided by MyProjects, you define a POP account configuration in `/path/to/sraos/etc/app-config.xml`. The following is an example configuration for a gmail pop-enabled account: 

```
<param id="email" type="my-projects" value="myprojects@mydomain.com" /> 
<param id="host" type="my-projects" value="pop.gmail.com" /> 
<param id="name" type="my-projects" value="MyProjects" /> 
<param id="pswd" type="my-projects" value="mypassword" /> 
<param id="skipTokens" type="my-projects" value="AutoReply|Out of Office" /> 
<param id="tls" type="my-projects" value="1" /> 
<param id="truncTokens" type="my-projects" value="-----|/On(.*)sent:/|/On(.*)wrote:/" /> 
<param id="user" type="my-projects" value="myprojects@mydomain.com" />
<!-- process incoming MyProjects email-based comments every 5 minutes --> 
<scheduled-task class-name="MyProjectsManager" method="retrievePopMessages" path="plugins/productivity/MyProjectsManager.php" schedule="2,7,12,17,22,27,32,37,42,47,52,57 * * * *" />
```

## Java whiteboard configuration
In order to utilize the java applet-based whiteboards, you must install Java on the server. This may be as easy as `yum install java`. Once installed, you will need to update the path in `etc/drawboard.ini` if it is different than /usr/bin/java`

If you are running a firewall such as iptables, you must allow access for the port range portStart through portEnd defined in `etc/drawboard.ini`. for example: 

  * `vi /etc/sysconfig/iptables`
  * insert: `-A RH-Firewall-1-INPUT -m state --state NEW -m tcp -p tcp --dport 7904:7994 -j ACCEPT`
  * `service iptables restart`

You must also add a scheduled task to /path/to/sraos/etc/app-config.xml: 

```
<!-- update active drawboards (background image and user count) every minute --> 
<scheduled-task class-name="MyProjectsManager" method="manageActiveDrawboards" path="plugins/productivity/MyProjectsManager.php" schedule="* * * * *" />
```

## Install indexing tools
In order to incorporate full text (based on the MySQL full text index) file indexing in MyProjects, you need to install a few utilities that allow for conversion of non-text files to text. Once you have installed these tools, you should add the following indexing parameters to `/path/to/sierra-php/etc/sierra-config.xml`:

```
<param id="application/pdf" type="file-converter" value="/usr/bin/pdftotext ${input} ${output}" /> 
<param id="application/msword" type="file-converter" value="/usr/local/bin/catdoc ${input} > ${output}" /> 
<param id="application/excel" type="file-converter" value="/usr/local/bin/xls2csv ${input} > ${output}" /> 
<param id="application/powerpoint" type="file-converter" value="/usr/local/bin/catppt ${input} > ${output}" /> 
<param id="text/html text/xml" type="file-converter" value="/usr/local/bin/html2text ${input} > ${output}" />
```

## poppler-utils
`poppler-utils` provides the `pdftotext` PDF indexing utility. Installing it may be as easy as `yum install poppler-utils` depending on your Linux distribution.

## catdoc
[catdoc](http://www.wagner.pp.ru/~vitus/software/catdoc/) provides the `catdoc`, `xls2csv` and `catppt` Microsoft Office documents indexing utilities. There is no RPM available so you will need to download the source using the catdoc link, compile and install (note: you will need gcc installed in order to compile): EXAMPLE: 

  * `wget http://ftp.wagner.pp.ru/pub/catdoc/catdoc-0.94.2.tar.gz` 
  * `tar -zxvf catdoc-0.94.2.tar.gz`
  * `cd catdoc-0.94.2`
  * `./configure make make install`

## html2text
[html2text](http://www.mbayer.de/html2text/files.shtml) provides the `html2text` HTML indexing utility. There is no RPM available so you will need to download the source using the `catdoc` link, compile and install (note: you will need `gcc-c++` installed in order to compile): EXAMPLE: 

  * `wget ftp://ftp.ibiblio.org/pub/linux/apps/www/converters/html2text-1.3.2a.tar.gz`
  * `tar -zxvf html2text-1.3.2a.tar.gz`
  * `cd html2text-1.3.2a`
  * `./configure make make install`

## Install thumbnail/preview tools
You should have already installed [ImageMagick](http://www.imagemagick.org). Now you may also install the [html2ps](https://linux.die.net/man/1/html2ps) utility which will allow for thumbnail/preview creation for html files. To do so, first install the utility: EXAMPLE:

  * `wget http://user.it.uu.se/~jan/html2ps-1.0b5.tar.gz`
  * `tar -zxvf html2ps-1.0b5.tar.gz`
  * `cd html2ps-1.0b5`
  * `./install`

then add the `thumbnail-converter` parameter to `/path/to/sierra-php/etc/sierra-config.xml`:

```
<param id="text/html" type="thumbnail-converter" value="/usr/local/bin/html2ps ${input} > ${output}" />
```

## Increase APC memory size
If you have installed [php-apc](http://pecl.php.net/package/APC), you may want to increase the `shm_size` to 128 MB:

EXAMPLE: 

  * `vi /etc/php.d/apc.ini`
  * change variable to: `apc.shm_size=128`
  * `service httpd restart`
  
