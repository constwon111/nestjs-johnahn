import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}
  //
  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
    // return this.boardRepository.find();
  }
  //   getAllBoards(): Board[] {
  //     return this.boards;
  //   }
  //   createBoard(createBoardDto: createBoardDto) {
  //     const { title, description } = createBoardDto;
  //     const board: Board = {
  //       id: uuid(), //유니크한 아이디 생성해주는 모듈
  //       title,
  //       description,
  //       status: BoardStatus.PUBLIC,
  //     };
  //     this.boards.push(board);
  //     return board;
  //   }
  //

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;
    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });
    await this.boardRepository.save(board);
    return board;
  }

  async getBoardById(id: any): Promise<Board> {
    const found = await this.boardRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Cna't find Board with id ${id}`);
    }
    return found;
  }

  async deleteBoard(id: number, user: User): Promise<void> {
    const result = await this.boardRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  //   getBoardById(id: string): Board {
  //     const found = this.boards.find((board) => board.id === id);
  //     if (!found) {
  //       throw new NotFoundException(`Can't find Board with id ${id}`);
  //     }
  //     return found;
  //   }
  //   deleteBoard(id: string): void {
  //     const found = this.getBoardById(id);
  //     this.boards = this.boards.filter((board) => board.id !== found.id);
  //     // return found;
  //   }

  async updateBoardStatus(id: string, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
  //   updateBoardStatus(id: string, status: BoardStatus): Board {
  //     const board = this.getBoardById(id);
  //     board.status = status;
  //     return board;
  //   }
}
