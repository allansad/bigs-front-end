"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchBoards,
  createPost,
  updatePost,
  deletePost,
} from "@/api/board/boardCRUD";
import refreshAccessToken from "@/api/auth/refreshAccessToken";
import styles from "@/styles/board.module.scss";

interface Board {
  id: number;
  title: string;
  content: string;
  category: string;
}

export default function BoardPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("NOTICE");
  const [editId, setEditId] = useState<number | null>(null);

  const pageSize = 10;

  const router = useRouter();

  useEffect(() => {
    async function loadBoards() {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        router.push("/");
      }

      try {
        const data = await fetchBoards(
          page,
          pageSize,
          accessToken as string,
          refreshToken as string
        );
        setBoards(data.content);
        setTotalPages(data.totalPages ? data.totalPages : 1);
        setError(null);
      } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === "Unauthorized") {
          if (refreshToken) {
            try {
              const newToken = await refreshAccessToken(refreshToken);

              localStorage.setItem("accessToken", newToken.accessToken);
              localStorage.setItem("refreshToken", newToken.refreshToken);

              const data = await fetchBoards(
                page,
                pageSize,
                newToken.accessToken,
                refreshToken
              );
              setBoards(data.content);
              setTotalPages(data.totalPages);
              setError(null);
            } catch (error) {
              console.error(error);
              router.push("/");
            }
          }
        } else {
          router.push("/");
        }
      }
    }

    loadBoards();
  }, [page]);

  async function handleCreateBoard() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      router.push("/");
    }
    try {
      await createPost(
        title,
        content,
        category,
        accessToken as string,
        refreshToken as string
      );
      setTitle("");
      setContent("");
      setCategory("NOTICE");
      setPage(0);
    } catch (error) {
      setError((error as Error).message);
    }
  }

  async function handleUpdateBoard() {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      router.push("/");
    }

    if (!editId) return;

    try {
      await updatePost(
        editId,
        title,
        content,
        category,
        accessToken as string,
        refreshToken as string
      );
      setEditId(null);
      setTitle("");
      setContent("");
      setCategory("NOTICE");
      setPage(0);
    } catch (error) {
      setError((error as Error).message);
    }
  }

  async function handleDeleteBoard(id: number) {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      router.push("/");
    }
    try {
      await deletePost(id, accessToken as string, refreshToken as string);
      setBoards(boards.filter((board) => board.id !== id));
    } catch (error) {
      setError((error as Error).message);
    }
  }

  function handlePageChange(newPage: number) {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  }

  function handleEdit(board: Board) {
    setEditId(board.id);
    setTitle(board.title);
    setContent(board.content);
    setCategory(board.category);
  }

  return (
    <div className={styles.boardContainer}>
      <h1>게시판</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formGroup}>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="NOTICE">공지사항</option>
          <option value="GENERAL">일반</option>
        </select>
      </div>

      {editId ? (
        <button className={styles.submitBtn} onClick={handleUpdateBoard}>
          수정 완료
        </button>
      ) : (
        <button className={styles.submitBtn} onClick={handleCreateBoard}>
          글 작성
        </button>
      )}

      <div className={styles.boardList}>
        {boards.length > 0 ? (
          <ul>
            {boards.map((board) => (
              <li key={board.id} className={styles.boardItem}>
                <h3>{board.title}</h3>
                <p>{board.content}</p>
                <p>{board.category}</p>
                <button
                  className={styles.submitBtn}
                  onClick={() => handleEdit(board)}
                >
                  수정
                </button>
                <button
                  className={styles.submitBtn}
                  onClick={() => handleDeleteBoard(board.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
      <div className={styles.pageNavigation}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          이전
        </button>
        <span>
          페이지 {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
}
