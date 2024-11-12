export default async function register(
  email: string,
  userName: string,
  password: string,
  confirmPassword: string
) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SIGN_UP_URL as string,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          name: userName,
          password,
          confirmPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.username || "회원가입에 실패했습니다.");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
