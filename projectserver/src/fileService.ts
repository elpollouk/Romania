import * as fs from 'fs';
import * as pathModule from 'path';

export enum FileType {
    Unknown,
    File,
    Directory
}

export class FileEntry {
    constructor(
        public readonly name: string,
        public readonly type: FileType,
        public readonly size: number
    ) {

    }
}

function fileStatsToFileType(stats: fs.Stats): FileType {
    if (stats.isFile()) {
        return FileType.File;
    }
    else if (stats.isDirectory()) {
        return FileType.Directory;
    }
    else {
        return FileType.Unknown;
    }
}

export default class FileService {

    public constructor() {

    }

    private _getFileStats(path: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(path, (err, result) => {
                if (!!err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            })
        });
    }

    private _readDir(path: string): Promise<string[]> {
        return new Promise<string[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (!!err) {
                    reject(err);
                }
                else {
                    resolve(files);
                }
            });
        });
    }

    public async getFileList(path: string): Promise<FileEntry[]> {
        let list: FileEntry[] = [];
        let files = await this._readDir(path);

        for (let i = 0; i < files.length; i++) {
            let stats = await this._getFileStats(pathModule.join(path, files[i]));
            list.push(new FileEntry(
                files[i],
                fileStatsToFileType(stats),
                stats.size
            ));
        };

        return list;
    }
}