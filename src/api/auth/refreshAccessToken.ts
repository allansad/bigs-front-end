type Token = {
  accessToken: string;
  refreshToken: string;
};

export default async function refreshAccessToken(
  refreshToken: string
): Promise<Token> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_REFRESH_TOKEN_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("리프레시 토큰으로 액세스 토큰을 재발급할 수 없습니다.");
    }

    const data: Token = await response.json();
    return data;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    throw new Error("토큰 갱신 실패");
  }
}
