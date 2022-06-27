import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';
@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsConroller');
  constructor(private boardService: BoardsService) {}
  // nestjs
  //   @Get('/')
  //   getAllBoard(): Board[] {
  //     return this.boardService.getAllBoards();
  //   }
  @Get()
  getAllBoard(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return this.boardService.getAllBoards(user);
  }
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
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${user.username} creating a new board. Payload : ${JSON.stringify(
        createBoardDto,
      )} `,
    );
    return this.boardService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    console.log('hihi');
    return this.boardService.updateBoardStatus(id, status);
  }
  //   @Patch('/:id/status')
  //   updateBoardStatus(
  //     @Param('id') id: string,
  //     @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  //   ) {
  //     return this.boardService.updateBoardStatus(id, status);
  //   }
}
