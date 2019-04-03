/* create the root user. password (also root) should be immediately changed */
INSERT INTO os_user (admin_groups, admin_users, admin_workspaces, user_name, name, password, default_workspace, all_apps) VALUES ('1', '1', '1', 'root', 'Root', password('root'), 1, '1')
INSERT INTO os_group (name, owner_uid) VALUES ('root', 1)
INSERT INTO user_groups (uid, gid) VALUES (1, 1)
INSERT INTO workspace (background) VALUES (null)
INSERT INTO user_workspace (workspace_id, uid) VALUES (1, 1)

INSERT INTO os_group (name, owner_uid, system) VALUES ('userAdmin', 1, '1')
INSERT INTO user_groups (uid, gid) VALUES (1, 2)
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, permissions, type) VALUES (now(), now(), 'network', 1, 1, 493, 'folder_network')
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, permissions, type) VALUES (now(), now(), 'home', 1, 1, 509, 'folder_system')
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, parent, permissions, type) VALUES (now(), now(), 'root', 1, 1, 2, 448, 'folder_home')
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, parent, permissions, type) VALUES (now(), now(), 'trash', 1, 1, 3, 493, 'folder_trash')
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, parent, permissions, type) VALUES (now(), now(), 'workspaces', 1, 1, 3, 493, 'folder_system')
INSERT INTO core_vfs_node (date_created, date_modified, name, node_group, node_owner, parent, permissions, type) VALUES (now(), now(), 'Workspace 1', 1, 1, 5, 493, 'folder_desktop')
