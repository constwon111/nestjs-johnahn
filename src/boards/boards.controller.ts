import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { createBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
@Controller('boards')
export class BoardsController {
  constructor(private boardService: BoardsService) {}
  //   @Get('/')
  //   getAllBoard(): Board[] {
  //     return this.boardService.getAllBoards();
  //   }
  //   @Post()
  //   @UsePipes(ValidationPipe)
  //   createBoard(@Body() createBoardDto: createBoardDto): Board {
  //     return this.boardService.createBoard(createBoardDto);
  //   }
  //   @Get('/:id')
  //   getBoardById(@Param('id') id: string) {
  //     return this.boardService.getBoardById(id);
  //   }
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() CreateBoardDto: createBoardDto): Promise<Board> {
    return this.boardService.createBoard(CreateBoardDto);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardService.getBoardById(id);
  }
  //   @Delete('/:id')
  //   deleteBoard(@Param('id') id: string): void {
  //     this.boardService.deleteBoard(id);
  //   }
  //   @Patch('/:id/status')
  //   updateBoardStatus(
  //     @Param('id') id: string,
  //     @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  //   ) {
  //     return this.boardService.updateBoardStatus(id, status);
  //   }
}
