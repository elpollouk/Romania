import FileService, { FileEntry, FileType } from './fileService';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import 'mocha';
import { stat } from 'fs';

function fail(done: MochaDone) {
    return (err) => {
        done(err);
    }
}

function fileEntry(name: string, type: FileType, size: number) {
    return new FileEntry(name, type, size);
}

function statEntry(size: number, isFile: boolean) {
    return {
        size: size,
        isFile: () => isFile,
        isDirectory: () => !isFile
    };
}

describe('FileService', () => {

    let stubReaddir: sinon.SinonStub;
    let stubStat: sinon.SinonStub;
    let mockFileSystem;

    function addMockFile(path: string, size: number) {
        mockFileSystem.push({
            path: path,
            size: size,
            isFile: true
        });
    }

    beforeEach(() => {
        mockFileSystem = [];

        stubReaddir = sinon.stub(fs, 'readdir').callsFake((path, handler) => {
            let result: string[] = [];

            for (var i = 0; i < mockFileSystem.length; i++) {
                result.push(mockFileSystem[i].path);
            }

            handler(null, result);
        });

        stubStat = sinon.stub(fs, 'stat').callsFake((path, handler) => {
            let entry = null;

            for (let i = 0; i < mockFileSystem.length; i++) {
                if (mockFileSystem[i].path === path) {
                    entry = mockFileSystem[i];
                    break;
                }
            }

            if (!entry) {
                throw new Error(`Unexpected path: ${path}`);
            }
            
            handler(null, statEntry(entry.size, entry.isFile));
        });
    })

    afterEach(() => {
        stubReaddir.restore();
        stubStat.restore();
    });

    it('should return the correct file list', (done) => {
        addMockFile('a.txt', 5);
        addMockFile('b.bin', 7);
        addMockFile('c.png', 11);

        let fs = new FileService();
        fs.getFileList('.')
        .then((files) => {
            expect(files).to.eql([
                fileEntry('a.txt', FileType.File, 5),
                fileEntry('b.bin', FileType.File, 7),
                fileEntry('c.png', FileType.File, 11)
            ]);
        })
        .then(done, fail(done));
    });

});