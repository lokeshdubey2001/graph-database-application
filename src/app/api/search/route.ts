export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  return Response.json(
    { message: `Not implemented yet query: ${q}` },
    { status: 501 }
  );
}
