import FileService from './fileService';
import { expect } from 'chai';
import 'mocha';

describe('FileService', () => {

    it('should return the correct file list', () => {
        let fs = new FileService();
        expect(fs.getFiles()).to.eql([
            'a.txt',
            'b.bin',
            'c.png'
        ]);
    });

});