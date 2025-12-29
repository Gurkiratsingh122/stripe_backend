import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note, NoteDocument } from './notes.schema';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private readonly noteModel: Model<NoteDocument>,
  ) {}

  async create(dto: CreateNoteDto) {
    return this.noteModel.create(dto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { cursor, limit, categoryId } = paginationDto;
    let filter: any = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }
    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }
    const notes = await this.noteModel
      .find(filter)
      .populate('categoryId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      nextCursor: notes?.length ? notes[notes.length - 1].createdAt : null,
      data: notes.map(({ categoryId, ...rest }) => ({
        ...rest,
        categoryInfo: categoryId,
      })),
    };
  }

  async findOne(id: string) {
    const note = await this.noteModel
      .findById(id)
      .populate('categoryId', 'title');

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async update(id: string, dto: UpdateNoteDto) {
    const note = await this.noteModel.findByIdAndUpdate(id, dto, { new: true });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async remove(id: string) {
    const note = await this.noteModel.findByIdAndDelete(id);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return { message: 'Note deleted successfully' };
  }
}
