import ImageClientAPI from './image';
import AlbumClientAPI from './album';
import ThumbnailClientAPI from './thumbnail';

export default class ClientAPI {
    static Image = ImageClientAPI;
    static Album = AlbumClientAPI;
    static Thumbnail = ThumbnailClientAPI;
}