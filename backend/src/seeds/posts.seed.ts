import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Post, PostType } from '../entities/post.entity';
import { UserEntity } from '../entities/user.entity';
import { PostTag } from '../entities/post-tag.entity';

interface PostSeedData {
  title: string;
  content: string;
  fullContent: string;
  imageUrl: string;
  type: string;
  tags: PostTag[];
  likes: number;
  views: number;
  userId: number;
}

@Injectable()
export class PostsSeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostTag)
    private readonly postTagRepository: Repository<PostTag>,
  ) {}

  async seed() {
    const postCount = await this.postRepository.count();

    if (postCount > 0) {
      console.log('Posts already exist, skipping seed...');
      return;
    }

    console.log('Seeding posts...');

    // Get admin user for author
    const admin = await this.userRepository.findOne({ where: { email: 'admin@laten.com' } });

    if (!admin) {
      console.log('Admin user not found, please run admin seed first');
      return;
    }

    // Create tags
    const tags = await Promise.all([
      this.createTag('Học tập', 'Các bài viết liên quan đến học tập'),
      this.createTag('Kinh nghiệm', 'Chia sẻ kinh nghiệm học tập'),
      this.createTag('Kỹ năng', 'Phát triển kỹ năng'),
      this.createTag('Giáo dục', 'Thông tin về giáo dục'),
      this.createTag('Công nghệ', 'Ứng dụng công nghệ trong học tập'),
    ]);

    // Sample posts data
    const postsData = [
      {
        title: 'Cách học hiệu quả trong thời đại số',
        content: 'Tóm tắt về các phương pháp học tập hiệu quả khi sử dụng công nghệ...',
        fullContent: `
# Cách học hiệu quả trong thời đại số

Trong thời đại số hóa, việc học tập đã thay đổi đáng kể so với phương pháp truyền thống. Với sự phát triển của công nghệ, chúng ta có nhiều công cụ và phương tiện hơn để tiếp cận kiến thức.

## 1. Sử dụng ứng dụng học tập

Các ứng dụng học tập như Quizlet, Duolingo, và Khan Academy cung cấp nội dung học tập có cấu trúc và tương tác. Việc học trở nên thú vị hơn khi bạn có thể theo dõi tiến độ và nhận phần thưởng.

## 2. Phương pháp Pomodoro

Kỹ thuật Pomodoro - học tập tập trung trong 25 phút và nghỉ 5 phút - giúp duy trì sự tập trung và tránh kiệt sức. Có nhiều ứng dụng hỗ trợ phương pháp này.

## 3. Học tập dựa trên dự án

Thay vì học thuộc lòng, hãy áp dụng kiến thức vào các dự án thực tế. Điều này giúp ghi nhớ tốt hơn và phát triển kỹ năng giải quyết vấn đề.

## 4. Học cộng tác trực tuyến

Tham gia các diễn đàn, nhóm học tập trực tuyến để trao đổi kiến thức và học hỏi từ người khác. Việc giải thích kiến thức cho người khác cũng giúp bạn hiểu sâu hơn.

## 5. Sử dụng công cụ quản lý thời gian

Lên kế hoạch học tập và quản lý thời gian hiệu quả bằng các ứng dụng như Notion, Trello hoặc Google Calendar.

Bằng cách kết hợp các phương pháp trên, bạn có thể tận dụng tối đa công nghệ để nâng cao hiệu quả học tập trong thời đại số.
        `,
        imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8',
        type: PostType.REGULAR,
        tags: [tags[0], tags[3]], // Học tập, Giáo dục
        likes: 42,
        views: 156,
        userId: admin.id,
        isActive: true,
      },
      {
        title: 'Kỹ thuật ghi nhớ hiệu quả cho kỳ thi',
        content: 'Phương pháp ghi nhớ lâu dài và hiệu quả khi ôn thi...',
        fullContent: `
# Kỹ thuật ghi nhớ hiệu quả cho kỳ thi

Các kỹ thuật ghi nhớ đúng cách có thể giúp bạn tiết kiệm thời gian ôn tập và ghi nhớ thông tin lâu hơn khi chuẩn bị cho kỳ thi.

## Kỹ thuật không gian (Method of Loci)

Còn được gọi là "Cung điện trí nhớ", kỹ thuật này liên kết thông tin cần nhớ với các địa điểm quen thuộc. Khi cần nhớ lại, bạn hình dung mình đi qua các địa điểm đó và "nhặt" thông tin.

## Kỹ thuật liên kết (Link Method)

Tạo câu chuyện hoặc hình ảnh kết nối các thông tin cần nhớ. Não bộ ghi nhớ câu chuyện tốt hơn là các sự kiện riêng lẻ.

## Kỹ thuật chia nhỏ (Chunking)

Chia thông tin thành các phần nhỏ dễ quản lý. Ví dụ: nhớ số điện thoại bằng cách chia thành các nhóm 3-4 số.

## Lặp lại có khoảng cách (Spaced Repetition)

Thay vì học dồn, hãy ôn tập với khoảng thời gian tăng dần giữa các lần ôn. Điều này tăng khả năng ghi nhớ dài hạn.

## Kỹ thuật mnemonic

Tạo từ viết tắt, câu, bài hát hoặc hình ảnh để nhớ danh sách thông tin. Ví dụ: "VIBGYOR" để nhớ màu sắc của cầu vồng.

## Bản đồ tư duy (Mind Mapping)

Vẽ biểu đồ kết nối các ý tưởng liên quan, giúp hiểu và ghi nhớ mối quan hệ giữa các khái niệm.

Kết hợp các kỹ thuật này và điều chỉnh cho phù hợp với phong cách học tập cá nhân sẽ giúp việc ghi nhớ trở nên hiệu quả hơn.
        `,
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
        type: PostType.REGULAR,
        tags: [tags[0], tags[1]], // Học tập, Kinh nghiệm
        likes: 28,
        views: 103,
        userId: admin.id,
        isActive: true,
      },
      {
        title: '5 công cụ công nghệ hỗ trợ học tập hiệu quả',
        content: 'Giới thiệu các ứng dụng và công cụ giúp nâng cao hiệu quả học tập...',
        fullContent: `
# 5 công cụ công nghệ hỗ trợ học tập hiệu quả

Trong thời đại số hóa, có rất nhiều công cụ công nghệ giúp quá trình học tập trở nên hiệu quả hơn. Dưới đây là 5 công cụ nổi bật:

## 1. Notion - Tổ chức ghi chú và quản lý dự án

Notion là nền tảng all-in-one cho phép bạn tạo ghi chú, quản lý dự án, lưu trữ tài liệu và lên kế hoạch học tập. Tính linh hoạt của Notion cho phép tùy chỉnh theo nhu cầu cụ thể.

## 2. Anki - Hệ thống thẻ ghi nhớ thông minh

Anki sử dụng thuật toán lặp lại cách quãng để giúp bạn ghi nhớ hiệu quả. Nó đặc biệt hữu ích cho việc học từ vựng, thuật ngữ chuyên ngành và sự kiện lịch sử.

## 3. Zotero - Quản lý tài liệu tham khảo

Zotero giúp thu thập, tổ chức và trích dẫn tài liệu nghiên cứu. Đây là công cụ không thể thiếu cho sinh viên và nhà nghiên cứu khi làm luận văn hoặc báo cáo.

## 4. Forest - Tập trung và quản lý thời gian

Forest giúp bạn tránh mất tập trung vào điện thoại bằng cách "trồng cây" trong thời gian học tập. Nếu bạn rời khỏi ứng dụng, cây sẽ chết - tạo động lực để duy trì tập trung.

## 5. Microsoft OneNote/Google Keep - Ghi chú đa nền tảng

Các ứng dụng ghi chú như OneNote hoặc Google Keep cho phép bạn ghi lại ý tưởng, tạo danh sách việc cần làm và lưu trữ thông tin quan trọng, đồng bộ trên mọi thiết bị.

Việc kết hợp các công cụ này vào quá trình học tập sẽ giúp bạn tiết kiệm thời gian, nâng cao hiệu suất và đạt kết quả tốt hơn.
        `,
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        type: PostType.REGULAR,
        tags: [tags[0], tags[4]], // Học tập, Công nghệ
        likes: 35,
        views: 128,
        userId: admin.id,
      },
      {
        title: 'Phát triển kỹ năng học tập suốt đời',
        content: 'Tại sao và làm thế nào để duy trì thói quen học tập liên tục...',
        fullContent: `
# Phát triển kỹ năng học tập suốt đời

Trong thế giới biến đổi nhanh chóng, khả năng học hỏi liên tục không chỉ là lợi thế mà còn là kỹ năng sống còn. Học tập suốt đời không chỉ giúp bạn thích nghi với những thay đổi mà còn mang lại sự phát triển cá nhân và nghề nghiệp.

## Tầm quan trọng của học tập suốt đời

1. **Thích ứng với thay đổi**: Công nghệ và kiến thức phát triển với tốc độ chóng mặt, học tập liên tục giúp bạn không bị tụt hậu.
2. **Phát triển nghề nghiệp**: Những người luôn cập nhật kỹ năng thường có nhiều cơ hội thăng tiến hơn.
3. **Tăng cường sức khỏe tinh thần**: Học tập giúp não bộ hoạt động tích cực, giảm nguy cơ suy giảm nhận thức khi về già.

## Làm thế nào để phát triển thói quen học tập suốt đời

### 1. Nuôi dưỡng sự tò mò

Đặt câu hỏi và tìm kiếm câu trả lời. Sự tò mò là động lực tự nhiên cho việc học tập liên tục.

### 2. Xây dựng thói quen đọc sách

Đọc sách hằng ngày, từ sách chuyên ngành đến tiểu thuyết, mở rộng kiến thức và phát triển trí tưởng tượng.

### 3. Theo đuổi sở thích mới

Học một ngôn ngữ mới, một nhạc cụ, hay kỹ năng mới như nấu ăn, làm vườn - tất cả đều là cơ hội học hỏi.

### 4. Tận dụng học trực tuyến

Các khóa học trực tuyến (MOOCs), webinar, podcast cung cấp kiến thức từ các chuyên gia hàng đầu, thường miễn phí hoặc chi phí thấp.

### 5. Kết nối với người khác

Tham gia cộng đồng, câu lạc bộ hoặc nhóm học tập để trao đổi kiến thức và học hỏi từ người khác.

### 6. Phản ánh và áp dụng

Dành thời gian suy ngẫm về những gì đã học và tìm cách áp dụng vào cuộc sống thực tế.

Học tập suốt đời không phải là đích đến mà là hành trình. Bằng cách nuôi dưỡng niềm đam mê học hỏi, bạn không chỉ nâng cao kiến thức mà còn làm phong phú cuộc sống của mình.
        `,
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        type: PostType.REGULAR,
        tags: [tags[2], tags[3]], // Kỹ năng, Giáo dục
        likes: 52,
        views: 189,
        userId: admin.id,
      },
      {
        title: 'Trải nghiệm học trực tuyến và truyền thống - So sánh và kết hợp',
        content: 'Phân tích ưu nhược điểm của hai phương thức học tập...',
        fullContent: `
# Trải nghiệm học trực tuyến và truyền thống - So sánh và kết hợp

Trong những năm gần đây, giáo dục đã chứng kiến sự chuyển đổi lớn từ mô hình học truyền thống sang học trực tuyến, đặc biệt sau đại dịch COVID-19. Mỗi phương thức đều có những ưu điểm và hạn chế riêng, hiểu rõ chúng sẽ giúp người học kết hợp hiệu quả.

## Học truyền thống: Ưu và nhược điểm

### Ưu điểm:
- **Tương tác trực tiếp**: Giao tiếp trực tiếp với giáo viên và bạn học tạo môi trường học tập sôi động.
- **Kỷ luật và cấu trúc**: Lịch học cố định giúp người học duy trì kỷ luật và nhịp độ học tập.
- **Phát triển kỹ năng xã hội**: Môi trường lớp học rèn luyện kỹ năng giao tiếp và làm việc nhóm.
- **Phản hồi tức thời**: Nhận phản hồi ngay lập tức từ giáo viên khi gặp khó khăn.

### Nhược điểm:
- **Thiếu linh hoạt**: Lịch học cố định có thể không phù hợp với mọi người.
- **Chi phí cao**: Học phí, đi lại và tài liệu học tập thường tốn kém hơn.
- **Giới hạn địa lý**: Tiếp cận hạn chế với các khóa học từ xa.
- **Tốc độ học đồng nhất**: Khó điều chỉnh tốc độ học cho từng cá nhân.

## Học trực tuyến: Ưu và nhược điểm

### Ưu điểm:
- **Linh hoạt**: Học bất cứ khi nào, ở đâu, theo nhịp độ riêng.
- **Tiếp cận rộng rãi**: Cơ hội học từ các trường đại học và chuyên gia hàng đầu trên thế giới.
- **Chi phí thấp hơn**: Nhiều khóa học miễn phí hoặc chi phí thấp, tiết kiệm chi phí đi lại.
- **Học theo nhịp độ cá nhân**: Tự điều chỉnh tốc độ học theo khả năng.

### Nhược điểm:
- **Thiếu tương tác**: Hạn chế giao tiếp trực tiếp có thể gây cảm giác cô lập.
- **Đòi hỏi tự kỷ luật cao**: Không có giám sát trực tiếp, dễ mất động lực và trì hoãn.
- **Vấn đề kỹ thuật**: Phụ thuộc vào công nghệ và kết nối internet.
- **Giới hạn về thực hành**: Một số kỹ năng khó học trực tuyến (như phòng thí nghiệm).

## Kết hợp hiệu quả

Mô hình học tập kết hợp (blended learning) tận dụng ưu điểm của cả hai phương thức:

1. **Học lý thuyết trực tuyến**: Tiếp thu kiến thức cơ bản qua video, đọc tài liệu theo nhịp độ cá nhân.
2. **Thảo luận và thực hành trực tiếp**: Áp dụng kiến thức trong môi trường lớp học, nhận phản hồi từ giáo viên.
3. **Công cụ hỗ trợ số**: Sử dụng ứng dụng và nền tảng kỹ thuật số để tăng cường trải nghiệm học tập.
4. **Cộng đồng học tập**: Tham gia cả nhóm học trực tuyến và trực tiếp để duy trì động lực.

Không có phương pháp nào hoàn hảo cho tất cả. Người học thông minh sẽ biết lựa chọn và kết hợp các phương thức phù hợp nhất với nhu cầu, hoàn cảnh và phong cách học tập cá nhân.
        `,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        type: PostType.REGULAR,
        tags: [tags[0], tags[3], tags[4]], // Học tập, Giáo dục, Công nghệ
        likes: 38,
        views: 142,
        userId: admin.id,
      },
    ];

    // Create posts
    for (const postData of postsData) {
      const { tags: postTags, ...postInfo } = postData;
      const preparedData = this.preparePostData(postInfo);
      const post = this.postRepository.create(preparedData);
      await this.postRepository.save(post);

      // Add tags to post (create relations)
      if (postTags && postTags.length > 0) {
        for (const tag of postTags) {
          await this.createPostTagRelation(post.id, tag.id);
        }
      }
    }

    console.log(`Created ${postsData.length} sample posts`);
  }

  private async createTag(name: string, description: string): Promise<PostTag> {
    const existingTag = await this.postTagRepository.findOne({ where: { name } });

    if (existingTag) {
      return existingTag;
    }

    const tag = this.postTagRepository.create({ name, description });
    return this.postTagRepository.save(tag);
  }

  private preparePostData(data: any): DeepPartial<Post> {
    return {
      ...data,
      type: data.type === 'ARTICLE' ? PostType.REGULAR : PostType.QUESTION,
      isActive: true,
    };
  }

  private async createPostTagRelation(postId: number, tagId: number): Promise<void> {
    // Assuming you have a direct way to create the relation based on your entity design
    // This might need to be adjusted based on your exact database schema
    await this.postTagRepository.query(`INSERT INTO post_tags_relation ("postId", "tagId") VALUES ($1, $2)`, [
      postId,
      tagId,
    ]);
  }
}
