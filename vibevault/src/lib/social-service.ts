import { prisma } from './db';

export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function sendFriendRequest(senderId: string, receiverEmail: string) {
  const receiver = await findUserByEmail(receiverEmail);
  if (!receiver) {
    throw new Error('UserNotFound');
  }
  if (receiver.id === senderId) {
    throw new Error('CannotFriendSelf');
  }

  // Prevent duplicates and existing friendships (normalize pair ordering)
  const existingReq = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId: receiver.id },
        { senderId: receiver.id, receiverId: senderId },
      ],
      status: 'pending',
    },
  });
  if (existingReq) {
    throw new Error('RequestAlreadyExists');
  }

  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userAId: senderId, userBId: receiver.id },
        { userAId: receiver.id, userBId: senderId },
      ],
    },
  });
  if (existingFriendship) {
    throw new Error('AlreadyFriends');
  }

  return prisma.friendRequest.create({
    data: { senderId, receiverId: receiver.id },
  });
}

export async function respondToFriendRequest(
  receiverId: string,
  requestId: string,
  action: 'accept' | 'decline'
) {
  const fr = await prisma.friendRequest.findUnique({ where: { id: requestId } });
  if (!fr || fr.receiverId !== receiverId) {
    throw new Error('RequestNotFound');
  }
  if (fr.status !== 'pending') {
    throw new Error('RequestAlreadyHandled');
  }

  if (action === 'decline') {
    return prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'declined' },
    });
  }

  // accept → create friendship (store ordered pair to keep unique constraint)
  const [idA, idB] = fr.senderId < fr.receiverId ? [fr.senderId, fr.receiverId] : [fr.receiverId, fr.senderId];

  return prisma.$transaction([
    prisma.friendRequest.update({ where: { id: requestId }, data: { status: 'accepted' } }),
    prisma.friendship.upsert({
      where: { userAId_userBId: { userAId: idA, userBId: idB } },
      update: {},
      create: { userAId: idA, userBId: idB },
    }),
  ]);
}

export async function listFriends(userId: string) {
  const friendsA = await prisma.friendship.findMany({ where: { userAId: userId } });
  const friendsB = await prisma.friendship.findMany({ where: { userBId: userId } });
  const friendIds = [
    ...friendsA.map(f => f.userBId),
    ...friendsB.map(f => f.userAId),
  ];
  const users = await prisma.user.findMany({ where: { id: { in: friendIds } }, select: { id: true, email: true, name: true, image: true } });
  return users;
}

export async function listFriendRequests(userId: string) {
  const incoming = await prisma.friendRequest.findMany({
    where: { receiverId: userId, status: 'pending' },
    include: { sender: { select: { id: true, email: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const outgoing = await prisma.friendRequest.findMany({
    where: { senderId: userId, status: 'pending' },
    include: { receiver: { select: { id: true, email: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return { incoming, outgoing };
}

export async function getOrCreateSocialSettings(userId: string) {
  return prisma.socialSettings.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function updateSocialSettings(
  userId: string,
  input: Partial<{ isProfilePrivate: boolean; shareViewingHistory: boolean; shareEmotionalResponses: boolean }>
) {
  return prisma.socialSettings.update({
    where: { userId },
    data: input,
  });
}


