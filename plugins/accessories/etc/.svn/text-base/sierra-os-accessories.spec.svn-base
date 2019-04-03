Name: sierra-os-accessories
Version: 1.0
Release: 0
Summary: sierra-os accessories plugin
License: Apache License 2.0
Group: Applications/Internet
Source: sraos-accessories.tgz
ExclusiveOS: Linux
BuildRoot: %{_tmppath}/%{name}-root
Requires: sierra-os
Packager: jason.t.read@gmail.com

%define SIERRA_DIR /var/www/sierra
%define SRAOS_DIR %{SIERRA_DIR}/app/sraos

%description
sierra-os accessories plugin
The accessories plugin currently provides the MyContacts application and may be 
used in the future to provide additional accessory-like applications.

%prep
%setup -b 0 -n var

%build

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT/var
cp -rf $RPM_BUILD_DIR/var/* $RPM_BUILD_ROOT/var

%files
%defattr(-,root,root)
/var/www/*

%clean
rm -rf $RPM_BUILD_ROOT

%post
if [ "$1" = "1" ] ; then
  %{SIERRA_DIR}/bin/sra-clear-cache.php
fi

%postun
if [ $1 = 0 ]; then
  rm -rf %{SRAOS_DIR}/plugins/accessories
  rm -f %{SRAOS_DIR}/lib/model/Contact*
  rm -f %{SRAOS_DIR}/lib/model/AddressBook*
  %{SIERRA_DIR}/bin/sra-clear-cache.php
fi

%changelog

