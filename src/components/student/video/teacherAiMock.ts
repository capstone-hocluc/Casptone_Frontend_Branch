// PROTOTYPE - the backend has no AI endpoint. The chat and its canned answers
// are local mock UI until one exists.
export const quickActions = ['Tóm tắt bài học', 'Giải thích dễ hiểu', 'Cho ví dụ', 'Gợi ý làm bài']

export interface AiMessage {
  id: string
  role: 'ai' | 'user'
  text: string
}

export function getMockAiResponse(prompt: string, lessonTitle: string) {
  if (prompt.includes('Tóm tắt')) {
    return `Bài học "${lessonTitle}" tập trung vào cách nhận diện ý chính, lọc thông tin quan trọng và tránh các chi tiết gây nhiễu khi làm bài ĐGNL.`
  }
  if (prompt.includes('Giải thích')) {
    return 'Bạn có thể hiểu đơn giản là: trước khi chọn đáp án, hãy xác định câu hỏi đang cần ý chính, chi tiết hay suy luận từ văn bản.'
  }
  if (prompt.includes('ví dụ')) {
    return 'Ví dụ: nếu đoạn văn lặp lại nhiều lần một quan điểm, đó thường là tín hiệu cho ý chính thay vì một chi tiết phụ.'
  }
  if (prompt.includes('Gợi ý')) {
    return 'Hãy đọc câu hỏi trước, gạch ý chính từng đoạn, sau đó loại đáp án quá hẹp hoặc quá xa nội dung văn bản.'
  }
  return 'Mình đã ghi nhận câu hỏi của bạn. Với bản mock frontend này, mình sẽ gợi ý ngắn gọn: hãy tập trung vào mục tiêu chính của bài và thử áp dụng ngay vào câu hỏi luyện tập.'
}
