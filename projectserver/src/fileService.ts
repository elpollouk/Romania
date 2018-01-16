import * as fs from 'fs';

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

    public getFileList(path: string): Promise<FileEntry[]> {
        return new Promise<FileEntry[]>((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (!!err) {
                    reject(err);
                }
                else {
                    let list: FileEntry[] = [];
                    if (files.length == 0) {
                        resolve(list);
                        return;
                    }

                    let promise: Promise<void> = null;

                    for (let i = 0; i < files.length; i++) {
                        let p = this._getFileStats(path + '/' + files[i])
                        .then((stats) => {
                            list.push(new FileEntry(
                                files[i],
                                fileStatsToFileType(stats),
                                stats.size
                            ));
                        }, reject);

                        if (promise == null) {
                            promise = p;
                        }
                        else {
                            promise = promise.then(() => p);
                        }
                    }

                    promise.then(() => {
                        resolve(list);                        
                    });
                }
            });
        });
    }
}