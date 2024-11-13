import refreshAccessToken from "../auth/refreshAccessToken";

async function fetchWithAuthRetry(
  url: string,
  options: RequestInit,
  refreshToken: string
) {
  let response = await fetch(url, options);

  if (response.status === 401) {
    const newToken = await refreshAccessToken(refreshToken);

    if (newToken.accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newToken.accessToken}`,
      };

      response = await fetch(url, options);
    } else {
      throw new Error("토큰 갱신에 실패했습니다.");
    }
  }

  return response;
}

export async function fetchBoards(
  page: number,
  size: number,
  accessToken: string,
  refreshToken: string
) {
  const url = `${process.env.NEXT_PUBLIC_BOARDS_URL}?page=${page}&size=${size}`;
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetchWithAuthRetry(url, options, refreshToken);

  if (!response.ok) {
    throw new Error("글 목록을 불러오는 데 실패했습니다.");
  }

  const data = await response.json();
  return data;
}

export async function createPost(
  title: string,
  content: string,
  category: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${process.env.NEXT_PUBLIC_BOARDS_URL}`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, category }),
  };

  const response = await fetchWithAuthRetry(url, options, refreshToken);

  if (!response.ok) {
    throw new Error("글 작성에 실패했습니다.");
  }

  return await response.json();
}

export async function updatePost(
  id: number,
  title: string,
  content: string,
  category: string,
  accessToken: string,
  refreshToken: string
) {
  const url = `${process.env.NEXT_PUBLIC_BOARDS_URL}/${id}`;
  const options = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content, category }),
  };

  const response = await fetchWithAuthRetry(url, options, refreshToken);

  if (!response.ok) {
    throw new Error("글 수정에 실패했습니다.");
  }

  return await response.json();
}

export async function deletePost(
  id: number,
  accessToken: string,
  refreshToken: string
) {
  const url = `${process.env.NEXT_PUBLIC_BOARDS_URL}/${id}`;
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await fetchWithAuthRetry(url, options, refreshToken);

  if (!response.ok) {
    throw new Error("글 삭제에 실패했습니다.");
  }

  return await response.json();
}
