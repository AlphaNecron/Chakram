import {hasPermission, isAdmin, Permission} from 'lib/permission';
import prisma from 'lib/prisma';
import {VoidRequest, VoidResponse, withVoid} from 'middleware/withVoid';

async function handler(req: VoidRequest, res: VoidResponse) {
  const user = await req.getUser();
  if (!(user && user.role && isAdmin(user.role.permissions))) return res.unauthorized();
  const perms = Object.values(Permission).filter(y => typeof y === 'string');
  if (req.method === 'GET') {
    const roles = await prisma.role.findMany();
    return res.json(roles.map(x => ({
      ...x,
      permissionInteger: x.permissions,
      permissions: perms.filter(y => hasPermission(x.permissions, Permission[y]))
    })));
  } else return res.notAllowed();
}

export default withVoid(handler);
