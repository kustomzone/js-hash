'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sha384 = sha384;

var _uint = require('../uint64');

// Initialize table of round constants
// (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..311):
var k = [[0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc], [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118], [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2], [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694], [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65], [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5], [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4], [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70], [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df], [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b], [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30], [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8], [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8], [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3], [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec], [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b], [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178], [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b], [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c], [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]];

function cycle(state, w) {

	// initialize hash value for this chunk:
	var a = state[0];
	var b = state[1];
	var c = state[2];
	var d = state[3];
	var e = state[4];
	var f = state[5];
	var g = state[6];
	var h = state[7];

	// Main loop:
	// for j from 0 to 79
	for (var j = 0; j < 80; ++j) {
		// S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
		var s1 = (0, _uint.xor64)((0, _uint.xor64)((0, _uint.rot64)(e, 14), (0, _uint.rot64)(e, 18)), (0, _uint.rot64)(e, 41));
		// ch := (e and f) xor ((not e) and g)
		var ch = (0, _uint.xor64)((0, _uint.and64)(e, f), (0, _uint.and64)((0, _uint.not64)(e), g));
		// temp := h + S1 + ch + k[j] + w[j]
		var temp = (0, _uint.add64)((0, _uint.add64)(h, s1), (0, _uint.add64)((0, _uint.add64)(ch, k[j]), w[j]));
		// d := d + temp;
		d = (0, _uint.add64)(d, temp);
		// S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
		var s0 = (0, _uint.xor64)((0, _uint.xor64)((0, _uint.rot64)(a, 28), (0, _uint.rot64)(a, 34)), (0, _uint.rot64)(a, 39));
		// maj := (a and (b xor c)) xor (b and c)
		var maj = (0, _uint.xor64)((0, _uint.and64)(a, (0, _uint.xor64)(b, c)), (0, _uint.and64)(b, c));
		// temp := temp + S0 + maj
		temp = (0, _uint.add64)((0, _uint.add64)(temp, s0), maj);

		h = g;
		g = f;
		f = e;
		e = d;
		d = c;
		c = b;
		b = a;
		a = temp;
	}

	// Add this chunk's hash to result so far:
	state[0] = (0, _uint.add64)(state[0], a);
	state[1] = (0, _uint.add64)(state[1], b);
	state[2] = (0, _uint.add64)(state[2], c);
	state[3] = (0, _uint.add64)(state[3], d);
	state[4] = (0, _uint.add64)(state[4], e);
	state[5] = (0, _uint.add64)(state[5], f);
	state[6] = (0, _uint.add64)(state[6], g);
	state[7] = (0, _uint.add64)(state[7], h);
}

function call(h, data, o) {

	var w = new Array(80);

	// break chunk into sixteen 64-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (var j = 0; j < 16; ++j) {
		w[j] = (0, _uint.big64)(data, o + j * 8);
	}

	// Extend the sixteen 64-bit words into 80 64-bit words:
	// for j from 16 to 79
	for (var _j = 16; _j < 80; ++_j) {
		// s0 := (w[j-15] rightrotate 1) xor (w[j-15] rightrotate 8) xor (w[j-15] rightshift 7)
		var s0 = (0, _uint.xor64)((0, _uint.xor64)((0, _uint.rot64)(w[_j - 15], 1), (0, _uint.rot64)(w[_j - 15], 8)), (0, _uint.sh64)(w[_j - 15], 7));
		// s1 := (w[j-2] rightrotate 19) xor (w[j-2] rightrotate 61) xor (w[j-2] rightshift 6)
		var s1 = (0, _uint.xor64)((0, _uint.xor64)((0, _uint.rot64)(w[_j - 2], 19), (0, _uint.rot64)(w[_j - 2], 61)), (0, _uint.sh64)(w[_j - 2], 6));
		// w[j] := w[j-16] + s0 + w[j-7] + s1
		w[_j] = (0, _uint.add64)((0, _uint.add64)(w[_j - 16], s0), (0, _uint.add64)(w[_j - 7], s1));
	}

	cycle(h, w);
}

/**
 * SHA-384
 */
function sha384(bytes, n, digest) {

	// Note 1: All variables are unsigned 64 bits and wrap modulo 2^64 when calculating
	// Note 2: All constants in this pseudo code are in big endian

	// Initialize variables
	// (first 64 bits of the fractional parts of the square roots of the 9th through 16th primes 23..53)
	var h = [[0xcbbb9d5d, 0xc1059ed8], [0x629a292a, 0x367cd507], [0x9159015a, 0x3070dd17], [0x152fecd8, 0xf70e5939], [0x67332667, 0xffc00b31], [0x8eb44a87, 0x68581511], [0xdb0c2e0d, 0x64f98fa7], [0x47b5481d, 0xbefa4fa4]];

	// PREPARE

	var q = n / 8 | 0;
	var z = q * 8;
	var u = n - z;

	// append the bit '1' to the message
	var last = void 0;
	if (u > 0) {
		last = bytes[q] & ~0 << 7 - u;
	} else {
		last = 0x80;
	}

	// Process the message in successive 1024-bit chunks:
	// break message into 1024-bit chunks

	var m = n / 1024 | 0;
	var y = (n - 1024 * m) / 8 | 0;

	// offset in data
	var o = 0;

	// for each chunk
	for (var j = 0; j < m; ++j, o += 128) {
		call(h, bytes, o);
	}

	// last bytes + padding + length
	var tail = [];

	// last bytes
	for (var _j2 = 0; _j2 < y; ++_j2) {
		tail.push(bytes[o + _j2]);
	}

	// special care taken for the very last byte which could
	// have been modified if n is not a multiple of 8
	tail.push(last);

	// append 0 ≤ k < 1024 bits '0', so that the resulting
	// message length (in bits) is congruent to 896 (mod 1024)
	var g = 896 - (n + 1) % 1024;
	var zeroes = g / 8 | 0;

	if (g < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (var _j3 = 0; _j3 < -zeroes; ++_j3) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 896 / 8;
		tail = [];
	}

	// pad with zeroes
	for (var _j4 = 0; _j4 < zeroes; ++_j4) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 128-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 124) & 0xff);
	// tail.push((n >>> 116) & 0xff);
	// tail.push((n >>> 108) & 0xff);
	// tail.push((n >>> 96) & 0xff);
	// tail.push((n >>> 88) & 0xff);
	// tail.push((n >>> 80) & 0xff);
	// tail.push((n >>> 72) & 0xff);
	// tail.push((n >>> 64) & 0xff);
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push(n >>> 24 & 0xff);
	tail.push(n >>> 16 & 0xff);
	tail.push(n >>> 8 & 0xff);
	tail.push(n >>> 0 & 0xff);

	call(h, tail, 0);

	for (var i = 0, _j5 = 0; _j5 < 6; ++_j5) {
		digest[i] = h[_j5][0] >>> 24 & 0xff;
		++i;
		digest[i] = h[_j5][0] >>> 16 & 0xff;
		++i;
		digest[i] = h[_j5][0] >>> 8 & 0xff;
		++i;
		digest[i] = h[_j5][0] >>> 0 & 0xff;
		++i;
		digest[i] = h[_j5][1] >>> 24 & 0xff;
		++i;
		digest[i] = h[_j5][1] >>> 16 & 0xff;
		++i;
		digest[i] = h[_j5][1] >>> 8 & 0xff;
		++i;
		digest[i] = h[_j5][1] >>> 0 & 0xff;
		++i;
	}

	return digest;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYXNoL3NoYTM4NC5qcyJdLCJuYW1lcyI6WyJzaGEzODQiLCJrIiwiY3ljbGUiLCJzdGF0ZSIsInciLCJhIiwiYiIsImMiLCJkIiwiZSIsImYiLCJnIiwiaCIsImoiLCJzMSIsImNoIiwidGVtcCIsInMwIiwibWFqIiwiY2FsbCIsImRhdGEiLCJvIiwiQXJyYXkiLCJieXRlcyIsIm4iLCJkaWdlc3QiLCJxIiwieiIsInUiLCJsYXN0IiwibSIsInkiLCJ0YWlsIiwicHVzaCIsInplcm9lcyIsImkiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMkdnQkEsTSxHQUFBQSxNOztBQTNHaEI7O0FBRUE7QUFDQTtBQUNBLElBQU1DLElBQUksQ0FDVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBRFMsRUFDaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQURqQixFQUMyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBRDNDLEVBQ3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FEckUsRUFFVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBRlMsRUFFaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUZqQixFQUUyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBRjNDLEVBRXFFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FGckUsRUFHVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBSFMsRUFHaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUhqQixFQUcyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBSDNDLEVBR3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FIckUsRUFJVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBSlMsRUFJaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUpqQixFQUkyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBSjNDLEVBSXFFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FKckUsRUFLVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBTFMsRUFLaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQUxqQixFQUsyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBTDNDLEVBS3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FMckUsRUFNVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBTlMsRUFNaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQU5qQixFQU0yQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBTjNDLEVBTXFFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FOckUsRUFPVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBUFMsRUFPaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVBqQixFQU8yQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBUDNDLEVBT3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FQckUsRUFRVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBUlMsRUFRaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVJqQixFQVEyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBUjNDLEVBUXFFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FSckUsRUFTVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBVFMsRUFTaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVRqQixFQVMyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBVDNDLEVBU3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FUckUsRUFVVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBVlMsRUFVaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVZqQixFQVUyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBVjNDLEVBVXFFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FWckUsRUFXVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBWFMsRUFXaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVhqQixFQVcyQyxDQUFDLFVBQUQsRUFBYSxVQUFiLENBWDNDLEVBV3FFLENBQUMsVUFBRCxFQUFhLFVBQWIsQ0FYckUsRUFZVCxDQUFDLFVBQUQsRUFBYSxVQUFiLENBWlMsRUFZaUIsQ0FBQyxVQUFELEVBQWEsVUFBYixDQVpqQixFQVkyQyxDQUFDLFVBQUQsRUFBYSxV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Q0EsSUFBRXNCLENBQUY7QUFDQVYsU0FBT1UsQ0FBUCxJQUFhdkIsRUFBRUMsR0FBRixFQUFLLENBQUwsTUFBWSxFQUFiLEdBQW1CLElBQS9CO0FBQ0EsSUFBRXNCLENBQUY7QUFDQVYsU0FBT1UsQ0FBUCxJQUFhdkIsRUFBRUMsR0FBRixFQUFLLENBQUwsTUFBWSxFQUFiLEdBQW1CLElBQS9CO0FBQ0EsSUFBRXNCLENBQUY7QUFDQVYsU0FBT1UsQ0FBUCxJQUFhdkIsRUFBRUMsR0FBRixFQUFLLENBQUwsTUFBYSxDQUFkLEdBQW1CLElBQS9CO0FBQ0EsSUFBRXNCLENBQUY7QUFDQVYsU0FBT1UsQ0FBUCxJQUFhdkIsRUFBRUMsR0FBRixFQUFLLENBQUwsTUFBYSxDQUFkLEdBQW1CLElBQS9CO0FBQ0EsSUFBRXNCLENBQUY7QUFDQTs7QUFFRCxRQUFPVixNQUFQO0FBRUEiLCJmaWxlIjoic2hhMzg0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYWRkNjQgLCBhbmQ2NCAsIHhvcjY0ICwgcm90NjQgLCBub3Q2NCAsIGJpZzY0ICwgc2g2NCB9IGZyb20gJy4uL3VpbnQ2NCcgO1xuXG4vLyBJbml0aWFsaXplIHRhYmxlIG9mIHJvdW5kIGNvbnN0YW50c1xuLy8gKGZpcnN0IDY0IGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIGN1YmUgcm9vdHMgb2YgdGhlIGZpcnN0IDgwIHByaW1lcyAyLi4zMTEpOlxuY29uc3QgayA9IFtcblx0WzB4NDI4YTJmOTgsIDB4ZDcyOGFlMjJdLCBbMHg3MTM3NDQ5MSwgMHgyM2VmNjVjZF0sIFsweGI1YzBmYmNmLCAweGVjNGQzYjJmXSwgWzB4ZTliNWRiYTUsIDB4ODE4OWRiYmNdLFxuXHRbMHgzOTU2YzI1YiwgMHhmMzQ4YjUzOF0sIFsweDU5ZjExMWYxLCAweGI2MDVkMDE5XSwgWzB4OTIzZjgyYTQsIDB4YWYxOTRmOWJdLCBbMHhhYjFjNWVkNSwgMHhkYTZkODExOF0sXG5cdFsweGQ4MDdhYTk4LCAweGEzMDMwMjQyXSwgWzB4MTI4MzViMDEsIDB4NDU3MDZmYmVdLCBbMHgyNDMxODViZSwgMHg0ZWU0YjI4Y10sIFsweDU1MGM3ZGMzLCAweGQ1ZmZiNGUyXSxcblx0WzB4NzJiZTVkNzQsIDB4ZjI3Yjg5NmZdLCBbMHg4MGRlYjFmZSwgMHgzYjE2OTZiMV0sIFsweDliZGMwNmE3LCAweDI1YzcxMjM1XSwgWzB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTRdLFxuXHRbMHhlNDliNjljMSwgMHg5ZWYxNGFkMl0sIFsweGVmYmU0Nzg2LCAweDM4NGYyNWUzXSwgWzB4MGZjMTlkYzYsIDB4OGI4Y2Q1YjVdLCBbMHgyNDBjYTFjYywgMHg3N2FjOWM2NV0sXG5cdFsweDJkZTkyYzZmLCAweDU5MmIwMjc1XSwgWzB4NGE3NDg0YWEsIDB4NmVhNmU0ODNdLCBbMHg1Y2IwYTlkYywgMHhiZDQxZmJkNF0sIFsweDc2Zjk4OGRhLCAweDgzMTE1M2I1XSxcblx0WzB4OTgzZTUxNTIsIDB4ZWU2NmRmYWJdLCBbMHhhODMxYzY2ZCwgMHgyZGI0MzIxMF0sIFsweGIwMDMyN2M4LCAweDk4ZmIyMTNmXSwgWzB4YmY1OTdmYzcsIDB4YmVlZjBlZTRdLFxuXHRbMHhjNmUwMGJmMywgMHgzZGE4OGZjMl0sIFsweGQ1YTc5MTQ3LCAweDkzMGFhNzI1XSwgWzB4MDZjYTYzNTEsIDB4ZTAwMzgyNmZdLCBbMHgxNDI5Mjk2NywgMHgwYTBlNmU3MF0sXG5cdFsweDI3YjcwYTg1LCAweDQ2ZDIyZmZjXSwgWzB4MmUxYjIxMzgsIDB4NWMyNmM5MjZdLCBbMHg0ZDJjNmRmYywgMHg1YWM0MmFlZF0sIFsweDUzMzgwZDEzLCAweDlkOTViM2RmXSxcblx0WzB4NjUwYTczNTQsIDB4OGJhZjYzZGVdLCBbMHg3NjZhMGFiYiwgMHgzYzc3YjJhOF0sIFsweDgxYzJjOTJlLCAweDQ3ZWRhZWU2XSwgWzB4OTI3MjJjODUsIDB4MTQ4MjM1M2JdLFxuXHRbMHhhMmJmZThhMSwgMHg0Y2YxMDM2NF0sIFsweGE4MWE2NjRiLCAweGJjNDIzMDAxXSwgWzB4YzI0YjhiNzAsIDB4ZDBmODk3OTFdLCBbMHhjNzZjNTFhMywgMHgwNjU0YmUzMF0sXG5cdFsweGQxOTJlODE5LCAweGQ2ZWY1MjE4XSwgWzB4ZDY5OTA2MjQsIDB4NTU2NWE5MTBdLCBbMHhmNDBlMzU4NSwgMHg1NzcxMjAyYV0sIFsweDEwNmFhMDcwLCAweDMyYmJkMWI4XSxcblx0WzB4MTlhNGMxMTYsIDB4YjhkMmQwYzhdLCBbMHgxZTM3NmMwOCwgMHg1MTQxYWI1M10sIFsweDI3NDg3NzRjLCAweGRmOGVlYjk5XSwgWzB4MzRiMGJjYjUsIDB4ZTE5YjQ4YThdLFxuXHRbMHgzOTFjMGNiMywgMHhjNWM5NWE2M10sIFsweDRlZDhhYTRhLCAweGUzNDE4YWNiXSwgWzB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzNdLCBbMHg2ODJlNmZmMywgMHhkNmIyYjhhM10sXG5cdFsweDc0OGY4MmVlLCAweDVkZWZiMmZjXSwgWzB4NzhhNTYzNmYsIDB4NDMxNzJmNjBdLCBbMHg4NGM4NzgxNCwgMHhhMWYwYWI3Ml0sIFsweDhjYzcwMjA4LCAweDFhNjQzOWVjXSxcblx0WzB4OTBiZWZmZmEsIDB4MjM2MzFlMjhdLCBbMHhhNDUwNmNlYiwgMHhkZTgyYmRlOV0sIFsweGJlZjlhM2Y3LCAweGIyYzY3OTE1XSwgWzB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmJdLFxuXHRbMHhjYTI3M2VjZSwgMHhlYTI2NjE5Y10sIFsweGQxODZiOGM3LCAweDIxYzBjMjA3XSwgWzB4ZWFkYTdkZDYsIDB4Y2RlMGViMWVdLCBbMHhmNTdkNGY3ZiwgMHhlZTZlZDE3OF0sXG5cdFsweDA2ZjA2N2FhLCAweDcyMTc2ZmJhXSwgWzB4MGE2MzdkYzUsIDB4YTJjODk4YTZdLCBbMHgxMTNmOTgwNCwgMHhiZWY5MGRhZV0sIFsweDFiNzEwYjM1LCAweDEzMWM0NzFiXSxcblx0WzB4MjhkYjc3ZjUsIDB4MjMwNDdkODRdLCBbMHgzMmNhYWI3YiwgMHg0MGM3MjQ5M10sIFsweDNjOWViZTBhLCAweDE1YzliZWJjXSwgWzB4NDMxZDY3YzQsIDB4OWMxMDBkNGNdLFxuXHRbMHg0Y2M1ZDRiZSwgMHhjYjNlNDJiNl0sIFsweDU5N2YyOTljLCAweGZjNjU3ZTJhXSwgWzB4NWZjYjZmYWIsIDB4M2FkNmZhZWNdLCBbMHg2YzQ0MTk4YywgMHg0YTQ3NTgxN11cbl07XG5cbmZ1bmN0aW9uIGN5Y2xlIChzdGF0ZSwgdykge1xuXG5cdC8vIGluaXRpYWxpemUgaGFzaCB2YWx1ZSBmb3IgdGhpcyBjaHVuazpcblx0bGV0IGEgPSBzdGF0ZVswXTtcblx0bGV0IGIgPSBzdGF0ZVsxXTtcblx0bGV0IGMgPSBzdGF0ZVsyXTtcblx0bGV0IGQgPSBzdGF0ZVszXTtcblx0bGV0IGUgPSBzdGF0ZVs0XTtcblx0bGV0IGYgPSBzdGF0ZVs1XTtcblx0bGV0IGcgPSBzdGF0ZVs2XTtcblx0bGV0IGggPSBzdGF0ZVs3XTtcblxuXHQvLyBNYWluIGxvb3A6XG5cdC8vIGZvciBqIGZyb20gMCB0byA3OVxuXHRmb3IgKGxldCBqID0gMDsgaiA8IDgwOyArK2opIHtcblx0XHQvLyBTMSA6PSAoZSByaWdodHJvdGF0ZSAxNCkgeG9yIChlIHJpZ2h0cm90YXRlIDE4KSB4b3IgKGUgcmlnaHRyb3RhdGUgNDEpXG5cdFx0Y29uc3QgczEgPSB4b3I2NCh4b3I2NChyb3Q2NChlLCAxNCksIHJvdDY0KGUsIDE4KSksIHJvdDY0KGUsIDQxKSk7XG5cdFx0Ly8gY2ggOj0gKGUgYW5kIGYpIHhvciAoKG5vdCBlKSBhbmQgZylcblx0XHRjb25zdCBjaCA9IHhvcjY0KGFuZDY0KGUsIGYpLCBhbmQ2NChub3Q2NChlKSwgZykpO1xuXHRcdC8vIHRlbXAgOj0gaCArIFMxICsgY2ggKyBrW2pdICsgd1tqXVxuXHRcdGxldCB0ZW1wID0gYWRkNjQoYWRkNjQoaCwgczEpLCBhZGQ2NChhZGQ2NChjaCwga1tqXSksIHdbal0pKTtcblx0XHQvLyBkIDo9IGQgKyB0ZW1wO1xuXHRcdGQgPSBhZGQ2NChkLCB0ZW1wKTtcblx0XHQvLyBTMCA6PSAoYSByaWdodHJvdGF0ZSAyOCkgeG9yIChhIHJpZ2h0cm90YXRlIDM0KSB4b3IgKGEgcmlnaHRyb3RhdGUgMzkpXG5cdFx0Y29uc3QgczAgPSB4b3I2NCh4b3I2NChyb3Q2NChhLCAyOCksIHJvdDY0KGEsIDM0KSksIHJvdDY0KGEsIDM5KSk7XG5cdFx0Ly8gbWFqIDo9IChhIGFuZCAoYiB4b3IgYykpIHhvciAoYiBhbmQgYylcblx0XHRjb25zdCBtYWogPSB4b3I2NChhbmQ2NChhLCB4b3I2NChiLCBjKSksIGFuZDY0KGIsIGMpKTtcblx0XHQvLyB0ZW1wIDo9IHRlbXAgKyBTMCArIG1halxuXHRcdHRlbXAgPSBhZGQ2NChhZGQ2NCh0ZW1wLCBzMCksIG1haik7XG5cblx0XHRoID0gZztcblx0XHRnID0gZjtcblx0XHRmID0gZTtcblx0XHRlID0gZDtcblx0XHRkID0gYztcblx0XHRjID0gYjtcblx0XHRiID0gYTtcblx0XHRhID0gdGVtcDtcblx0fVxuXG5cdC8vIEFkZCB0aGlzIGNodW5rJ3MgaGFzaCB0byByZXN1bHQgc28gZmFyOlxuXHRzdGF0ZVswXSA9IGFkZDY0KHN0YXRlWzBdLCBhKTtcblx0c3RhdGVbMV0gPSBhZGQ2NChzdGF0ZVsxXSwgYik7XG5cdHN0YXRlWzJdID0gYWRkNjQoc3RhdGVbMl0sIGMpO1xuXHRzdGF0ZVszXSA9IGFkZDY0KHN0YXRlWzNdLCBkKTtcblx0c3RhdGVbNF0gPSBhZGQ2NChzdGF0ZVs0XSwgZSk7XG5cdHN0YXRlWzVdID0gYWRkNjQoc3RhdGVbNV0sIGYpO1xuXHRzdGF0ZVs2XSA9IGFkZDY0KHN0YXRlWzZdLCBnKTtcblx0c3RhdGVbN10gPSBhZGQ2NChzdGF0ZVs3XSwgaCk7XG59XG5cbmZ1bmN0aW9uIGNhbGwgKGgsIGRhdGEsIG8pIHtcblxuXHRjb25zdCB3ID0gbmV3IEFycmF5KDgwKTtcblxuXHQvLyBicmVhayBjaHVuayBpbnRvIHNpeHRlZW4gNjQtYml0IGJpZy1lbmRpYW4gd29yZHMgd1tpXSwgMCDiiaQgaSDiiaQgMTVcblx0Zm9yIChsZXQgaiA9IDA7IGogPCAxNjsgKytqKSB7XG5cdFx0d1tqXSA9IGJpZzY0KGRhdGEsIG8gKyBqICogOCk7XG5cdH1cblxuXHQvLyBFeHRlbmQgdGhlIHNpeHRlZW4gNjQtYml0IHdvcmRzIGludG8gODAgNjQtYml0IHdvcmRzOlxuXHQvLyBmb3IgaiBmcm9tIDE2IHRvIDc5XG5cdGZvciAobGV0IGogPSAxNjsgaiA8IDgwOyArK2opIHtcblx0XHQvLyBzMCA6PSAod1tqLTE1XSByaWdodHJvdGF0ZSAxKSB4b3IgKHdbai0xNV0gcmlnaHRyb3RhdGUgOCkgeG9yICh3W2otMTVdIHJpZ2h0c2hpZnQgNylcblx0XHRjb25zdCBzMCA9IHhvcjY0KHhvcjY0KHJvdDY0KHdbai0xNV0sICAxKSwgcm90NjQod1tqLTE1XSwgIDgpKSwgc2g2NCh3W2otMTVdLCA3KSk7XG5cdFx0Ly8gczEgOj0gKHdbai0yXSByaWdodHJvdGF0ZSAxOSkgeG9yICh3W2otMl0gcmlnaHRyb3RhdGUgNjEpIHhvciAod1tqLTJdIHJpZ2h0c2hpZnQgNilcblx0XHRjb25zdCBzMSA9IHhvcjY0KHhvcjY0KHJvdDY0KHdbai0gMl0sIDE5KSwgcm90NjQod1tqLSAyXSwgNjEpKSwgc2g2NCh3W2otIDJdLCA2KSk7XG5cdFx0Ly8gd1tqXSA6PSB3W2otMTZdICsgczAgKyB3W2otN10gKyBzMVxuXHRcdHdbal0gPSBhZGQ2NChhZGQ2NCh3W2otMTZdLCBzMCksIGFkZDY0KHdbai03XSwgczEpKTtcblx0fVxuXG5cdGN5Y2xlKGgsIHcpO1xuXG59XG5cblxuXG4vKipcbiAqIFNIQS0zODRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoYTM4NCAoYnl0ZXMsIG4sIGRpZ2VzdCkge1xuXG5cdC8vIE5vdGUgMTogQWxsIHZhcmlhYmxlcyBhcmUgdW5zaWduZWQgNjQgYml0cyBhbmQgd3JhcCBtb2R1bG8gMl42NCB3aGVuIGNhbGN1bGF0aW5nXG5cdC8vIE5vdGUgMjogQWxsIGNvbnN0YW50cyBpbiB0aGlzIHBzZXVkbyBjb2RlIGFyZSBpbiBiaWcgZW5kaWFuXG5cblx0Ly8gSW5pdGlhbGl6ZSB2YXJpYWJsZXNcblx0Ly8gKGZpcnN0IDY0IGJpdHMgb2YgdGhlIGZyYWN0aW9uYWwgcGFydHMgb2YgdGhlIHNxdWFyZSByb290cyBvZiB0aGUgOXRoIHRocm91Z2ggMTZ0aCBwcmltZXMgMjMuLjUzKVxuXHRjb25zdCBoID0gW1xuXHRcdFsweGNiYmI5ZDVkLCAweGMxMDU5ZWQ4XSxcblx0XHRbMHg2MjlhMjkyYSwgMHgzNjdjZDUwN10sXG5cdFx0WzB4OTE1OTAxNWEsIDB4MzA3MGRkMTddLFxuXHRcdFsweDE1MmZlY2Q4LCAweGY3MGU1OTM5XSxcblx0XHRbMHg2NzMzMjY2NywgMHhmZmMwMGIzMV0sXG5cdFx0WzB4OGViNDRhODcsIDB4Njg1ODE1MTFdLFxuXHRcdFsweGRiMGMyZTBkLCAweDY0Zjk4ZmE3XSxcblx0XHRbMHg0N2I1NDgxZCwgMHhiZWZhNGZhNF1cblx0XTtcblxuXHQvLyBQUkVQQVJFXG5cblx0Y29uc3QgcSA9IG4gLyA4IHwgMDtcblx0Y29uc3QgeiA9IHEgKiA4O1xuXHRjb25zdCB1ID0gbiAtIHo7XG5cblx0Ly8gYXBwZW5kIHRoZSBiaXQgJzEnIHRvIHRoZSBtZXNzYWdlXG5cdGxldCBsYXN0IDtcblx0aWYgKHUgPiAwKSB7XG5cdFx0bGFzdCA9IGJ5dGVzW3FdICYgKH4wKSA8PCAoNy11KTtcblx0fVxuXHRlbHNlIHtcblx0XHRsYXN0ID0gMHg4MDtcblx0fVxuXG5cblx0Ly8gUHJvY2VzcyB0aGUgbWVzc2FnZSBpbiBzdWNjZXNzaXZlIDEwMjQtYml0IGNodW5rczpcblx0Ly8gYnJlYWsgbWVzc2FnZSBpbnRvIDEwMjQtYml0IGNodW5rc1xuXG5cdGNvbnN0IG0gPSBuIC8gMTAyNCB8IDA7XG5cdGNvbnN0IHkgPSAobiAtIDEwMjQgKiBtKSAvIDggfCAwO1xuXG5cdC8vIG9mZnNldCBpbiBkYXRhXG5cdGxldCBvID0gMDtcblxuXHQvLyBmb3IgZWFjaCBjaHVua1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IG07ICsraiwgbyArPSAxMjgpIHtcblx0XHRjYWxsKGgsIGJ5dGVzLCBvKTtcblx0fVxuXG5cdC8vIGxhc3QgYnl0ZXMgKyBwYWRkaW5nICsgbGVuZ3RoXG5cdGxldCB0YWlsID0gW107XG5cblx0Ly8gbGFzdCBieXRlc1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IHk7ICsraikge1xuXHRcdHRhaWwucHVzaChieXRlc1tvICsgal0pO1xuXHR9XG5cblx0Ly8gc3BlY2lhbCBjYXJlIHRha2VuIGZvciB0aGUgdmVyeSBsYXN0IGJ5dGUgd2hpY2ggY291bGRcblx0Ly8gaGF2ZSBiZWVuIG1vZGlmaWVkIGlmIG4gaXMgbm90IGEgbXVsdGlwbGUgb2YgOFxuXHR0YWlsLnB1c2gobGFzdCk7XG5cblxuXHQvLyBhcHBlbmQgMCDiiaQgayA8IDEwMjQgYml0cyAnMCcsIHNvIHRoYXQgdGhlIHJlc3VsdGluZ1xuXHQvLyBtZXNzYWdlIGxlbmd0aCAoaW4gYml0cykgaXMgY29uZ3J1ZW50IHRvIDg5NiAobW9kIDEwMjQpXG5cdGNvbnN0IGcgPSAoODk2IC0gKG4gKyAxKSAlIDEwMjQpO1xuXHRsZXQgemVyb2VzID0gZyAvIDggfCAwO1xuXG5cdGlmIChnIDwgMCkge1xuXHRcdC8vIHdlIG5lZWQgYW4gYWRkaXRpb25hbCBibG9jayBhcyB0aGVyZSBpc1xuXHRcdC8vIG5vdCBlbm91Z2ggc3BhY2UgbGVmdCB0byBhcHBlbmRcblx0XHQvLyB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhIGluIGJpdHNcblxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgLXplcm9lczsgKytqKSB7XG5cdFx0XHR0YWlsLnB1c2goMCk7XG5cdFx0fVxuXG5cdFx0Y2FsbChoLCB0YWlsLCAwKTtcblxuXHRcdHplcm9lcyA9IDg5NiAvIDg7XG5cdFx0dGFpbCA9IFtdO1xuXHR9XG5cblxuXHQvLyBwYWQgd2l0aCB6ZXJvZXNcblx0Zm9yIChsZXQgaiA9IDA7IGogPCB6ZXJvZXM7ICsraikge1xuXHRcdHRhaWwucHVzaCgwKTtcblx0fVxuXG5cdC8vIGFwcGVuZCBsZW5ndGggb2YgbWVzc2FnZSAoYmVmb3JlIHByZXBhcmF0aW9uKSwgaW4gYml0cyxcblx0Ly8gYXMgMTI4LWJpdCBiaWctZW5kaWFuIGludGVnZXJcblxuXHQvLyBKYXZhU2NyaXB0IHdvcmtzIHdpdGggMzIgYml0IGludGVnZXJzLlxuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDEyNCkgJiAweGZmKTtcblx0Ly8gdGFpbC5wdXNoKChuID4+PiAxMTYpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gMTA4KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDk2KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDg4KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDgwKSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDcyKSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDY0KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDU2KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDQ4KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDQwKSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDMyKSAmIDB4ZmYpO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXG5cdHRhaWwucHVzaCgobiA+Pj4gMjQpICYgMHhmZik7XG5cdHRhaWwucHVzaCgobiA+Pj4gMTYpICYgMHhmZik7XG5cdHRhaWwucHVzaCgobiA+Pj4gIDgpICYgMHhmZik7XG5cdHRhaWwucHVzaCgobiA+Pj4gIDApICYgMHhmZik7XG5cblx0Y2FsbChoLCB0YWlsLCAwKTtcblxuXHRmb3IgKGxldCBpID0gMCwgaiA9IDA7IGogPCA2OyArK2opIHtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVswXSA+Pj4gMjQpICYgMHhmZjtcblx0XHQrK2k7XG5cdFx0ZGlnZXN0W2ldID0gKGhbal1bMF0gPj4+IDE2KSAmIDB4ZmY7XG5cdFx0KytpO1xuXHRcdGRpZ2VzdFtpXSA9IChoW2pdWzBdID4+PiAgOCkgJiAweGZmO1xuXHRcdCsraTtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVswXSA+Pj4gIDApICYgMHhmZjtcblx0XHQrK2k7XG5cdFx0ZGlnZXN0W2ldID0gKGhbal1bMV0gPj4+IDI0KSAmIDB4ZmY7XG5cdFx0KytpO1xuXHRcdGRpZ2VzdFtpXSA9IChoW2pdWzFdID4+PiAxNikgJiAweGZmO1xuXHRcdCsraTtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVsxXSA+Pj4gIDgpICYgMHhmZjtcblx0XHQrK2k7XG5cdFx0ZGlnZXN0W2ldID0gKGhbal1bMV0gPj4+ICAwKSAmIDB4ZmY7XG5cdFx0KytpO1xuXHR9XG5cblx0cmV0dXJuIGRpZ2VzdDtcblxufVxuIl19