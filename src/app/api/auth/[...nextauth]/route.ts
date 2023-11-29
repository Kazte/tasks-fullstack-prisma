import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import prisma from '~/libs/prisma';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jdoe@email.com' },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'password'
        }
      },
      async authorize(credentials: any, _req) {
        const userFound = await prisma.user.findUnique({
          where: { email: credentials?.email }
        });

        if (!userFound) throw new Error('User not found!');

        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error('Invalid Credentials');

        return {
          id: userFound.id,
          email: userFound.email,
          name: userFound.username
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
