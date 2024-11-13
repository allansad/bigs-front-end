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

import BoardForm from "./BoardForm";

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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      if ((error as Error).message === "redirect") {
        router.push("/");
      }

      setError((error as Error).message);
    } finally {
      closeModal();
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
      if ((error as Error).message === "토큰 갱신 실패") {
        router.push("/");
      }

      setError((error as Error).message);
    } finally {
      closeModal();
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
      if ((error as Error).message === "토큰 갱신 실패") {
        router.push("/");
      }

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

  function openModal() {
    setTitle("");
    setContent("");
    setCategory("NOTICE");
    setEditId(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className={styles.boardContainer}>
      <h1>게시판</h1>
      <button onClick={openModal} className={styles.openModalBtn}>
        글 작성
      </button>
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
      {error && <p className={styles.error}>{error}</p>}

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
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeModalBtn}>
              닫기
            </button>
            <BoardForm
              title={title}
              content={content}
              category={category}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onCategoryChange={setCategory}
              onSubmit={editId ? handleUpdateBoard : handleCreateBoard}
              editId={editId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
