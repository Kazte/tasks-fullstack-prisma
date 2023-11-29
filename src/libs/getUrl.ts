const IS_SERVER = typeof window === 'undefined';
export default function getURL() {
  const baseURL = IS_SERVER
    ? process.env.NEXTAUTH_URL!
    : window.location.origin;
  return baseURL;
}
