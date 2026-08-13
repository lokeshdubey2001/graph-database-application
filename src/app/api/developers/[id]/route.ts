export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return Response.json(
    { message: `Not implemented yet id: ${id}` },
    { status: 501 }
  );
}
