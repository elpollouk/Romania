import FileService, { FileEntry, FileType } from './fileService';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import 'mocha';

function fail(done: MochaDone) {
    return (err) => {
        done(err);
    }
}

function fileEntry(name: string, type: FileType, size: number) {
    return new FileEntry(name, type, size);
}

describe('FileService', () => {

    beforeEach(() => {
        let stub = sinon.stub(fs, 'readdir').callsFake((path, handler) => {
            handler(null, [
                'a.txt', 'b.bin', 'c.png'
            ]);
        });
    })

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