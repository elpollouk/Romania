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

    beforeEach(() => {
        stubReaddir = sinon.stub(fs, 'readdir').callsFake((path, handler) => {
            handler(null, [
                'a.txt', 'b.bin', 'c.png'
            ]);
        });

        stubStat = sinon.stub(fs, 'stat').callsFake((path, handler) => {
            let result;

            switch (path) {
                case 'a.txt':
                    result = statEntry(5, true);
                    break;

                case 'b.bin':
                    result = statEntry(7, true);
                    break;

                case 'c.png':
                    result = statEntry(11, true);
                    break;

                default:
                    throw new Error(`Unexpected path: ${path}`);
            }

            handler(null, result);
        });
    })

    afterEach(() => {
        stubReaddir.restore();
        stubStat.restore();
    });

    it('should return the correct file list', (done) => {
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