"use client";

import styles from "@/styles/board.module.scss";

interface BoardFormProps {
  title: string;
  content: string;
  category: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
  editId: number | null;
}

export default function BoardForm({
  title,
  content,
  category,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onSubmit,
  editId,
}: BoardFormProps) {
  return (
    <div className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          placeholder="내용"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="NOTICE">공지사항</option>
          <option value="GENERAL">일반</option>
        </select>
      </div>

      <button className={styles.submitBtn} onClick={onSubmit}>
        {editId ? "수정 완료" : "글 작성"}
      </button>
    </div>
  );
}
