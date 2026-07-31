import { POST as createUserPost } from "../users/route";

export async function POST(request: Request) {
  return createUserPost(request);
}
