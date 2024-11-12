export default async function login(email: string, password: string) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SING_IN_URL as string,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
