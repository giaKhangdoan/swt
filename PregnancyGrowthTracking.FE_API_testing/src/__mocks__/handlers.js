import { rest } from 'msw';
import { API_BASE_URL } from '../api/constants/apiEndpoints';

export const handlers = [
  // Mock API lấy danh sách reminder
  rest.get(`${API_BASE_URL}/Reminder/history`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          remindId: 1,
          title: "Uống thuốc sắt",
          date: "2023-03-15",
          time: "08:00",
          reminderType: "Uống thuốc",
          notification: "Nhớ uống thuốc đúng giờ"
        },
        {
          remindId: 2,
          title: "Khám thai định kỳ",
          date: "2023-03-20",
          time: "10:00",
          reminderType: "Cuộc hẹn bác sĩ",
          notification: "Mang theo sổ khám thai"
        }
      ])
    );
  }),

  // Mock API tạo reminder mới
  rest.post(`${API_BASE_URL}/Reminder/create`, async (req, res, ctx) => {
    const data = await req.json();
    return res(
      ctx.status(201),
      ctx.json({
        remindId: 3,
        ...data
      })
    );
  }),

  // Mock API lấy danh sách foetus
  rest.get(`${API_BASE_URL}/Foetus`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          foetusId: 1,
          name: "Bé Yêu",
          gender: "Nam",
          userId: 1
        }
      ])
    );
  }),

  // Mock API lấy danh sách blog
  rest.get(`${API_BASE_URL}/Blog`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        posts: [
          {
            id: 1,
            title: "Dinh dưỡng cho mẹ bầu",
            body: "Nội dung bài viết về dinh dưỡng...",
            categories: ["dinh dưỡng", "mẹ bầu"],
            createdAt: "2023-03-10T10:00:00Z"
          }
        ]
      })
    );
  })
]; 