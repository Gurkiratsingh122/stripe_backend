import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Notes')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post()
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notesService.create({ ...dto, userId: req.user.userId });
  }

  @UseInterceptors(ResponseInterceptor)
  @Get()
  @ApiQuery({ name: 'cursor', type: String, required: false })
  @ApiQuery({ name: 'limit', type: String, required: false })
  findAll(@Req() req, @Query() paginationDto: PaginationDto) {
    return this.notesService.findAll(paginationDto, req.user.userId);
  }

  @UseInterceptors(ResponseInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @UseInterceptors(ResponseInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @UseInterceptors(ResponseInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
