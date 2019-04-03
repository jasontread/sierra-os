-include ../common/common.mk

SRAOS			 := sraos
RPMDIR		 := rpm-build
SIERRA_DIR := $(RPMDIR)/var/www/sierra
SRAOS_DIR	 := $(SIERRA_DIR)/app/sraos

.PHONY: all
all: setup repodata/repomd.xml teardown

.PHONY: rpm
rpm: ${RPMDIR}/${SRAOS}-accessories.tgz .rpmmacros
	mkdir -p ${RPMDIR}/tmp
	HOME=$(CURDIR) rpmbuild --clean -bb --target i386 ./etc/sierra-os-accessories.spec

.rpmmacros: Makefile
	echo '%_topdir			$(CURDIR)/$(RPMDIR)' > $@
	echo '%_tmpdir			$(CURDIR)/$(RPMDIR)/tmp' >> $@
	echo '%_builddir		$(CURDIR)/$(RPMDIR)/tmp' >> $@
	echo '%_sourcedir	 $(CURDIR)/$(RPMDIR)' >> $@
	echo '%_specdir		 $(CURDIR)/spec' >> $@
	echo '%_rpmdir			$(CURDIR)' >> $@
	echo '%_build_name_fmt	%%{NAME}.rpm' >> $@

.PHONY: clean
clean:
	rm -rf *.rpm rpm-build .rpmmacros repodata

setup:
	rm -rf $(RPMDIR)
	mkdir -p $(SRAOS_DIR)/plugins/accessories
	rm -rf repodata
	mkdir -p repodata

teardown:
	rm -rf $(RPMDIR)
	rm -f *debuginfo.rpm
	rm -rf repodata
	rm -f .rpmmacros

repodata/repomd.xml: rpm
	createrepo .

${RPMDIR}/${SRAOS}-accessories.tgz:
	cp plugin.xml $(SRAOS_DIR)/plugins/accessories/
	cp -r etc $(SRAOS_DIR)/plugins/accessories/
	cp -r lib $(SRAOS_DIR)/plugins/accessories/
	cp -r tpl $(SRAOS_DIR)/plugins/accessories/
	cp -r www $(SRAOS_DIR)/plugins/accessories/
	rm -f $(SRAOS_DIR)/plugins/accessories/etc/*.spec
	cd $(SRAOS_DIR)/plugins/accessories && find . -depth -name ".svn" -exec rm -rf '{}' \;
	cd ${RPMDIR} && tar -czf $(SRAOS)-accessories.tgz var && rm -rf var
