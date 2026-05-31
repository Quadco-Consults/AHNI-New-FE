from modules.users.models.user import User

# Get admin@mail.com user
admin = User.objects.get(email='admin@mail.com')
print(f'User: {admin.email}')
print(f'Is Superuser: {admin.is_superuser}')
print(f'Is Staff: {admin.is_staff}')
print(f'Position: {admin.position}')
print()

# Check if user has permissions attribute
if hasattr(admin, 'user_permissions'):
    perms = admin.user_permissions.all()
    print(f'Direct Permissions: {perms.count()}')
    for perm in perms:
        print(f'  - {perm.codename}')
else:
    print('No user_permissions attribute')

# Check if user has groups
if hasattr(admin, 'groups'):
    groups = admin.groups.all()
    print(f'\nGroups: {groups.count()}')
    for group in groups:
        print(f'  - {group.name}')
        group_perms = group.permissions.all()
        print(f'    Permissions: {group_perms.count()}')
else:
    print('No groups attribute')

# Check all permissions using get_all_permissions
if hasattr(admin, 'get_all_permissions'):
    all_perms = admin.get_all_permissions()
    print(f'\nAll Permissions (get_all_permissions): {len(all_perms)}')
    approval_perms = [p for p in all_perms if 'approv' in p.lower()]
    print(f'Approval-related permissions: {approval_perms}')
else:
    print('No get_all_permissions method')
