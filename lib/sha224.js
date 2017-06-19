'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sha224 = sha224;

var _jsUint = require('@aureooms/js-uint32');

var k = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

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

	//Main loop:
	//for j from 0 to 63
	for (var j = 0; j < 64; ++j) {
		//S1 := (e rightrotate 6) xor (e rightrotate 11) xor (e rightrotate 25)
		var s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
		//ch := (e and f) xor ((not e) and g)
		var ch = e & f ^ ~e & g;
		//temp := h + S1 + ch + k[j] + w[j]
		var temp = (0, _jsUint.add32)((0, _jsUint.add32)(h, s1), (0, _jsUint.add32)((0, _jsUint.add32)(ch, k[j]), w[j]));
		//d := d + temp;
		d = (0, _jsUint.add32)(d, temp);
		//S0 := (a rightrotate 2) xor (a rightrotate 13) xor (a rightrotate 22)
		var s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
		//maj := (a and (b xor c)) xor (b and c)
		var maj = a & (b ^ c) ^ b & c;
		//temp := temp + S0 + maj
		temp = (0, _jsUint.add32)((0, _jsUint.add32)(temp, s0), maj);

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
	state[0] = (0, _jsUint.add32)(state[0], a);
	state[1] = (0, _jsUint.add32)(state[1], b);
	state[2] = (0, _jsUint.add32)(state[2], c);
	state[3] = (0, _jsUint.add32)(state[3], d);
	state[4] = (0, _jsUint.add32)(state[4], e);
	state[5] = (0, _jsUint.add32)(state[5], f);
	state[6] = (0, _jsUint.add32)(state[6], g);
	state[7] = (0, _jsUint.add32)(state[7], h);
}

function call(h, data, o) {

	var w = new Array(64);

	// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (var j = 0; j < 16; ++j) {
		w[j] = (0, _jsUint.big32)(data, o + j * 4);
	}

	// Extend the sixteen 32-bit words into sixty-four 32-bit words:
	// for j from 16 to 63
	for (var _j = 16; _j < 64; ++_j) {
		//s0 := (w[j-15] rightrotate 7) xor (w[j-15] rightrotate 18) xor (w[j-15] rightshift 3)
		var s0 = (w[_j - 15] >>> 7 | w[_j - 15] << 25) ^ (w[_j - 15] >>> 18 | w[_j - 15] << 14) ^ w[_j - 15] >>> 3;
		//s1 := (w[j-2] rightrotate 17) xor (w[j-2] rightrotate 19) xor (w[j-2] rightshift 10)
		var s1 = (w[_j - 2] >>> 17 | w[_j - 2] << 15) ^ (w[_j - 2] >>> 19 | w[_j - 2] << 13) ^ w[_j - 2] >>> 10;
		//w[j] := w[j-16] + s0 + w[j-7] + s1
		w[_j] = (0, _jsUint.add32)((0, _jsUint.add32)(w[_j - 16], s0), (0, _jsUint.add32)(w[_j - 7], s1));
	}

	cycle(h, w);
}

/**
 * SHA-224
 *
 * SHA-224 is identical to SHA-256, except that:
 *  - the initial variable values h0 through h7 are different, and
 *  - the output is constructed by omitting h7.
 */
function sha224(bytes, n, digest) {

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

	// Note 1: All variables are unsigned 32 bits and wrap modulo 2^32 when calculating
	// Note 2: All constants in this pseudo code are in big endian.
	// Within each word, the most significant byte is stored in the leftmost byte position

	// Initialize state:
	var h = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];

	// Process the message in successive 512-bit chunks:
	// break message into 512-bit chunks

	var m = n / 512 | 0;
	var y = (n - 512 * m) / 8 | 0;

	// offset in data
	var o = 0;

	// for each chunk
	for (var j = 0; j < m; ++j, o += 64) {
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

	// append 0 ≤ k < 512 bits '0', so that the resulting
	// message length (in bits) is congruent to 448 (mod 512)
	var zeroes = (448 - (n + 1) % 512) / 8 | 0;

	if (zeroes < 0) {
		// we need an additional block as there is
		// not enough space left to append
		// the length of the data in bits

		for (var _j3 = 0; _j3 < -zeroes; ++_j3) {
			tail.push(0);
		}

		call(h, tail, 0);

		zeroes = 448 / 8;
		tail = [];
	}

	// pad with zeroes
	for (var _j4 = 0; _j4 < zeroes; ++_j4) {
		tail.push(0);
	}

	// append length of message (before preparation), in bits,
	// as 64-bit big-endian integer

	// JavaScript works with 32 bit integers.
	// tail.push((n >>> 56) & 0xff);
	// tail.push((n >>> 48) & 0xff);
	// tail.push((n >>> 40) & 0xff);
	// tail.push((n >>> 32) & 0xff);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push(n >>> 24 & 0xff);
	tail.push(n >>> 16 & 0xff);
	tail.push(n >>> 8 & 0xff);
	tail.push(n >>> 0 & 0xff);

	call(h, tail, 0);

	digest[0] = h[0] >>> 24 & 0xff;
	digest[1] = h[0] >>> 16 & 0xff;
	digest[2] = h[0] >>> 8 & 0xff;
	digest[3] = h[0] >>> 0 & 0xff;
	digest[4] = h[1] >>> 24 & 0xff;
	digest[5] = h[1] >>> 16 & 0xff;
	digest[6] = h[1] >>> 8 & 0xff;
	digest[7] = h[1] >>> 0 & 0xff;
	digest[8] = h[2] >>> 24 & 0xff;
	digest[9] = h[2] >>> 16 & 0xff;
	digest[10] = h[2] >>> 8 & 0xff;
	digest[11] = h[2] >>> 0 & 0xff;
	digest[12] = h[3] >>> 24 & 0xff;
	digest[13] = h[3] >>> 16 & 0xff;
	digest[14] = h[3] >>> 8 & 0xff;
	digest[15] = h[3] >>> 0 & 0xff;
	digest[16] = h[4] >>> 24 & 0xff;
	digest[17] = h[4] >>> 16 & 0xff;
	digest[18] = h[4] >>> 8 & 0xff;
	digest[19] = h[4] >>> 0 & 0xff;
	digest[20] = h[5] >>> 24 & 0xff;
	digest[21] = h[5] >>> 16 & 0xff;
	digest[22] = h[5] >>> 8 & 0xff;
	digest[23] = h[5] >>> 0 & 0xff;
	digest[24] = h[6] >>> 24 & 0xff;
	digest[25] = h[6] >>> 16 & 0xff;
	digest[26] = h[6] >>> 8 & 0xff;
	digest[27] = h[6] >>> 0 & 0xff;

	return digest;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGEyMjQuanMiXSwibmFtZXMiOlsic2hhMjI0IiwiayIsImN5Y2xlIiwic3RhdGUiLCJ3IiwiYSIsImIiLCJjIiwiZCIsImUiLCJmIiwiZyIsImgiLCJqIiwiczEiLCJjaCIsInRlbXAiLCJzMCIsIm1haiIsImNhbGwiLCJkYXRhIiwibyIsIkFycmF5IiwiYnl0ZXMiLCJuIiwiZGlnZXN0IiwicSIsInoiLCJ1IiwibGFzdCIsIm0iLCJ5IiwidGFpbCIsInB1c2giLCJ6ZXJvZXMiXSwibWFwcGluZ3MiOiI7Ozs7O1FBaUdnQkEsTSxHQUFBQSxNOztBQWpHaEI7O0FBRUEsSUFBTUMsSUFBSSxDQUNULFVBRFMsRUFDRyxVQURILEVBQ2UsVUFEZixFQUMyQixVQUQzQixFQUN1QyxVQUR2QyxFQUNtRCxVQURuRCxFQUMrRCxVQUQvRCxFQUMyRSxVQUQzRSxFQUVULFVBRlMsRUFFRyxVQUZILEVBRWUsVUFGZixFQUUyQixVQUYzQixFQUV1QyxVQUZ2QyxFQUVtRCxVQUZuRCxFQUUrRCxVQUYvRCxFQUUyRSxVQUYzRSxFQUdULFVBSFMsRUFHRyxVQUhILEVBR2UsVUFIZixFQUcyQixVQUgzQixFQUd1QyxVQUh2QyxFQUdtRCxVQUhuRCxFQUcrRCxVQUgvRCxFQUcyRSxVQUgzRSxFQUlULFVBSlMsRUFJRyxVQUpILEVBSWUsVUFKZixFQUkyQixVQUozQixFQUl1QyxVQUp2QyxFQUltRCxVQUpuRCxFQUkrRCxVQUovRCxFQUkyRSxVQUozRSxFQUtULFVBTFMsRUFLRyxVQUxILEVBS2UsVUFMZixFQUsyQixVQUwzQixFQUt1QyxVQUx2QyxFQUttRCxVQUxuRCxFQUsrRCxVQUwvRCxFQUsyRSxVQUwzRSxFQU1ULFVBTlMsRUFNRyxVQU5ILEVBTWUsVUFOZixFQU0yQixVQU4zQixFQU11QyxVQU52QyxFQU1tRCxVQU5uRCxFQU0rRCxVQU4vRCxFQU0yRSxVQU4zRSxFQU9ULFVBUFMsRUFPRyxVQVBILEVBT2UsVUFQZixFQU8yQixVQVAzQixFQU91QyxVQVB2QyxFQU9tRCxVQVBuRCxFQU8rRCxVQVAvRCxFQU8yRSxVQVAzRSxFQVFULFVBUlMsRUFRRyxVQVJILEVBUWUsVUFSZixFQVEyQixVQVIzQixFQVF1QyxVQVJ2QyxFQVFtRCxVQVJuRCxFQVErRCxVQVIvRCxFQVEyRSxVQVIzRSxDQUFWOztBQVdBLFNBQVNDLEtBQVQsQ0FBZ0JDLEtBQWhCLEVBQXVCQyxDQUF2QixFQUEwQjs7QUFFekI7QUFDQSxLQUFJQyxJQUFJRixNQUFNLENBQU4sQ0FBUjtBQUNBLEtBQUlHLElBQUlILE1BQU0sQ0FBTixDQUFSO0FBQ0EsS0FBSUksSUFBSUosTUFBTSxDQUFOLENBQVI7QUFDQSxLQUFJSyxJQUFJTCxNQUFNLENBQU4sQ0FBUjtBQUNBLEtBQUlNLElBQUlOLE1BQU0sQ0FBTixDQUFSO0FBQ0EsS0FBSU8sSUFBSVAsTUFBTSxDQUFOLENBQVI7QUFDQSxLQUFJUSxJQUFJUixNQUFNLENBQU4sQ0FBUjtBQUNBLEtBQUlTLElBQUlULE1BQU0sQ0FBTixDQUFSOztBQUVBO0FBQ0E7QUFDQSxNQUFJLElBQUlVLElBQUksQ0FBWixFQUFlQSxJQUFJLEVBQW5CLEVBQXVCLEVBQUVBLENBQXpCLEVBQTJCO0FBQzFCO0FBQ0EsTUFBTUMsS0FBSyxDQUFDTCxNQUFNLENBQU4sR0FBVUEsS0FBSyxFQUFoQixLQUFzQkEsTUFBTSxFQUFOLEdBQVdBLEtBQUssRUFBdEMsS0FBNENBLE1BQU0sRUFBTixHQUFXQSxLQUFLLENBQTVELENBQVg7QUFDQTtBQUNBLE1BQU1NLEtBQU1OLElBQUlDLENBQUwsR0FBWSxDQUFDRCxDQUFGLEdBQU9FLENBQTdCO0FBQ0E7QUFDQSxNQUFJSyxPQUFPLG1CQUFNLG1CQUFNSixDQUFOLEVBQVNFLEVBQVQsQ0FBTixFQUFvQixtQkFBTSxtQkFBTUMsRUFBTixFQUFVZCxFQUFFWSxDQUFGLENBQVYsQ0FBTixFQUF1QlQsRUFBRVMsQ0FBRixDQUF2QixDQUFwQixDQUFYO0FBQ0E7QUFDQUwsTUFBSSxtQkFBTUEsQ0FBTixFQUFTUSxJQUFULENBQUo7QUFDQTtBQUNBLE1BQU1DLEtBQUssQ0FBQ1osTUFBTSxDQUFOLEdBQVVBLEtBQUssRUFBaEIsS0FBdUJBLE1BQU0sRUFBTixHQUFXQSxLQUFLLEVBQXZDLEtBQThDQSxNQUFNLEVBQU4sR0FBV0EsS0FBSyxFQUE5RCxDQUFYO0FBQ0E7QUFDQSxNQUFNYSxNQUFPYixLQUFLQyxJQUFJQyxDQUFULENBQUQsR0FBaUJELElBQUlDLENBQWpDO0FBQ0E7QUFDQVMsU0FBTyxtQkFBTSxtQkFBTUEsSUFBTixFQUFZQyxFQUFaLENBQU4sRUFBdUJDLEdBQXZCLENBQVA7O0FBRUFOLE1BQUlELENBQUo7QUFDQUEsTUFBSUQsQ0FBSjtBQUNBQSxNQUFJRCxDQUFKO0FBQ0FBLE1BQUlELENBQUo7QUFDQUEsTUFBSUQsQ0FBSjtBQUNBQSxNQUFJRCxDQUFKO0FBQ0FBLE1BQUlELENBQUo7QUFDQUEsTUFBSVcsSUFBSjtBQUNBOztBQUVEO0FBQ0FiLE9BQU0sQ0FBTixJQUFXLG1CQUFNQSxNQUFNLENBQU4sQ0FBTixFQUFnQkUsQ0FBaEIsQ0FBWDtBQUNBRixPQUFNLENBQU4sSUFBVyxtQkFBTUEsTUFBTSxDQUFOLENBQU4sRUFBZ0JHLENBQWhCLENBQVg7QUFDQUgsT0FBTSxDQUFOLElBQVcsbUJBQU1BLE1BQU0sQ0FBTixDQUFOLEVBQWdCSSxDQUFoQixDQUFYO0FBQ0FKLE9BQU0sQ0FBTixJQUFXLG1CQUFNQSxNQUFNLENBQU4sQ0FBTixFQUFnQkssQ0FBaEIsQ0FBWDtBQUNBTCxPQUFNLENBQU4sSUFBVyxtQkFBTUEsTUFBTSxDQUFOLENBQU4sRUFBZ0JNLENBQWhCLENBQVg7QUFDQU4sT0FBTSxDQUFOLElBQVcsbUJBQU1BLE1BQU0sQ0FBTixDQUFOLEVBQWdCTyxDQUFoQixDQUFYO0FBQ0FQLE9BQU0sQ0FBTixJQUFXLG1CQUFNQSxNQUFNLENBQU4sQ0FBTixFQUFnQlEsQ0FBaEIsQ0FBWDtBQUNBUixPQUFNLENBQU4sSUFBVyxtQkFBTUEsTUFBTSxDQUFOLENBQU4sRUFBZ0JTLENBQWhCLENBQVg7QUFFQTs7QUFFRCxTQUFTTyxJQUFULENBQWVQLENBQWYsRUFBa0JRLElBQWxCLEVBQXdCQyxDQUF4QixFQUEyQjs7QUFFMUIsS0FBTWpCLElBQUksSUFBSWtCLEtBQUosQ0FBVSxFQUFWLENBQVY7O0FBRUE7QUFDQSxNQUFLLElBQUlULElBQUksQ0FBYixFQUFnQkEsSUFBSSxFQUFwQixFQUF3QixFQUFFQSxDQUExQixFQUE2QjtBQUM1QlQsSUFBRVMsQ0FBRixJQUFPLG1CQUFNTyxJQUFOLEVBQVlDLElBQUlSLElBQUksQ0FBcEIsQ0FBUDtBQUNBOztBQUVEO0FBQ0E7QUFDQSxNQUFLLElBQUlBLEtBQUksRUFBYixFQUFpQkEsS0FBSSxFQUFyQixFQUF5QixFQUFFQSxFQUEzQixFQUE4QjtBQUM3QjtBQUNBLE1BQU1JLEtBQUssQ0FBQ2IsRUFBRVMsS0FBRSxFQUFKLE1BQVksQ0FBWixHQUFnQlQsRUFBRVMsS0FBRSxFQUFKLEtBQVcsRUFBNUIsS0FBbUNULEVBQUVTLEtBQUUsRUFBSixNQUFZLEVBQVosR0FBaUJULEVBQUVTLEtBQUUsRUFBSixLQUFXLEVBQS9ELElBQXNFVCxFQUFFUyxLQUFFLEVBQUosTUFBWSxDQUE3RjtBQUNBO0FBQ0EsTUFBTUMsS0FBSyxDQUFDVixFQUFFUyxLQUFFLENBQUosTUFBVyxFQUFYLEdBQWdCVCxFQUFFUyxLQUFFLENBQUosS0FBVSxFQUEzQixLQUFrQ1QsRUFBRVMsS0FBRSxDQUFKLE1BQVcsRUFBWCxHQUFnQlQsRUFBRVMsS0FBRSxDQUFKLEtBQVUsRUFBNUQsSUFBbUVULEVBQUVTLEtBQUUsQ0FBSixNQUFXLEVBQXpGO0FBQ0E7QUFDQVQsSUFBRVMsRUFBRixJQUFPLG1CQUFNLG1CQUFNVCxFQUFFUyxLQUFFLEVBQUosQ0FBTixFQUFlSSxFQUFmLENBQU4sRUFBMEIsbUJBQU1iLEVBQUVTLEtBQUUsQ0FBSixDQUFOLEVBQWNDLEVBQWQsQ0FBMUIsQ0FBUDtBQUNBOztBQUVEWixPQUFNVSxDQUFOLEVBQVNSLENBQVQ7QUFFQTs7QUFHRDs7Ozs7OztBQU9PLFNBQVNKLE1BQVQsQ0FBaUJ1QixLQUFqQixFQUF3QkMsQ0FBeEIsRUFBMkJDLE1BQTNCLEVBQW1DOztBQUV6Qzs7QUFFQSxLQUFNQyxJQUFJRixJQUFJLENBQUosR0FBUSxDQUFsQjtBQUNBLEtBQU1HLElBQUlELElBQUksQ0FBZDtBQUNBLEtBQU1FLElBQUlKLElBQUlHLENBQWQ7O0FBRUE7QUFDQSxLQUFJRSxhQUFKO0FBQ0EsS0FBSUQsSUFBSSxDQUFSLEVBQVc7QUFDVkMsU0FBT04sTUFBTUcsQ0FBTixJQUFZLENBQUMsQ0FBRixJQUFTLElBQUVFLENBQTdCO0FBQ0EsRUFGRCxNQUdLO0FBQ0pDLFNBQU8sSUFBUDtBQUNBOztBQUlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQU1qQixJQUFJLENBQUMsVUFBRCxFQUFhLFVBQWIsRUFBeUIsVUFBekIsRUFBcUMsVUFBckMsRUFBaUQsVUFBakQsRUFBNkQsVUFBN0QsRUFBeUUsVUFBekUsRUFBcUYsVUFBckYsQ0FBVjs7QUFFQTtBQUNBOztBQUVBLEtBQU1rQixJQUFJTixJQUFJLEdBQUosR0FBVSxDQUFwQjtBQUNBLEtBQU1PLElBQUksQ0FBQ1AsSUFBSSxNQUFNTSxDQUFYLElBQWdCLENBQWhCLEdBQW9CLENBQTlCOztBQUVBO0FBQ0EsS0FBSVQsSUFBSSxDQUFSOztBQUVBO0FBQ0EsTUFBSyxJQUFJUixJQUFJLENBQWIsRUFBZ0JBLElBQUlpQixDQUFwQixFQUF1QixFQUFFakIsQ0FBRixFQUFLUSxLQUFLLEVBQWpDLEVBQXFDO0FBQ3BDRixPQUFLUCxDQUFMLEVBQVFXLEtBQVIsRUFBZUYsQ0FBZjtBQUNBOztBQUVEO0FBQ0EsS0FBSVcsT0FBTyxFQUFYOztBQUVBO0FBQ0EsTUFBSyxJQUFJbkIsTUFBSSxDQUFiLEVBQWdCQSxNQUFJa0IsQ0FBcEIsRUFBdUIsRUFBRWxCLEdBQXpCLEVBQTRCO0FBQzNCbUIsT0FBS0MsSUFBTCxDQUFVVixNQUFNRixJQUFJUixHQUFWLENBQVY7QUFDQTs7QUFFRDtBQUNBO0FBQ0FtQixNQUFLQyxJQUFMLENBQVVKLElBQVY7O0FBR0E7QUFDQTtBQUNBLEtBQUlLLFNBQVMsQ0FBQyxNQUFNLENBQUNWLElBQUksQ0FBTCxJQUFVLEdBQWpCLElBQXdCLENBQXhCLEdBQTRCLENBQXpDOztBQUVBLEtBQUlVLFNBQVMsQ0FBYixFQUFnQjtBQUNmO0FBQ0E7QUFDQTs7QUFFQSxPQUFLLElBQUlyQixNQUFJLENBQWIsRUFBZ0JBLE1BQUksQ0FBQ3FCLE1BQXJCLEVBQTZCLEVBQUVyQixHQUEvQixFQUFrQztBQUNqQ21CLFFBQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0E7O0FBRURkLE9BQUtQLENBQUwsRUFBUW9CLElBQVIsRUFBYyxDQUFkOztBQUVBRSxXQUFTLE1BQU0sQ0FBZjtBQUNBRixTQUFPLEVBQVA7QUFDQTs7QUFHRDtBQUNBLE1BQUssSUFBSW5CLE1BQUksQ0FBYixFQUFnQkEsTUFBSXFCLE1BQXBCLEVBQTRCLEVBQUVyQixHQUE5QixFQUFpQztBQUNoQ21CLE9BQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0E7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FELE1BQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0FELE1BQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0FELE1BQUtDLElBQUwsQ0FBVSxDQUFWO0FBQ0FELE1BQUtDLElBQUwsQ0FBVSxDQUFWOztBQUVBRCxNQUFLQyxJQUFMLENBQVdULE1BQU0sRUFBUCxHQUFhLElBQXZCO0FBQ0FRLE1BQUtDLElBQUwsQ0FBV1QsTUFBTSxFQUFQLEdBQWEsSUFBdkI7QUFDQVEsTUFBS0MsSUFBTCxDQUFXVCxNQUFPLENBQVIsR0FBYSxJQUF2QjtBQUNBUSxNQUFLQyxJQUFMLENBQVdULE1BQU8sQ0FBUixHQUFhLElBQXZCOztBQUVBTCxNQUFLUCxDQUFMLEVBQVFvQixJQUFSLEVBQWMsQ0FBZDs7QUFFQVAsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxDQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWEsUUFBTyxFQUFQLElBQWNiLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7O0FBRUEsUUFBT2EsTUFBUDtBQUVBIiwiZmlsZSI6InNoYTIyNC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFkZDMyICwgYmlnMzIgfSBmcm9tICdAYXVyZW9vbXMvanMtdWludDMyJyA7XG5cbmNvbnN0IGsgPSBbXG5cdDB4NDI4YTJmOTgsIDB4NzEzNzQ0OTEsIDB4YjVjMGZiY2YsIDB4ZTliNWRiYTUsIDB4Mzk1NmMyNWIsIDB4NTlmMTExZjEsIDB4OTIzZjgyYTQsIDB4YWIxYzVlZDUsXG5cdDB4ZDgwN2FhOTgsIDB4MTI4MzViMDEsIDB4MjQzMTg1YmUsIDB4NTUwYzdkYzMsIDB4NzJiZTVkNzQsIDB4ODBkZWIxZmUsIDB4OWJkYzA2YTcsIDB4YzE5YmYxNzQsXG5cdDB4ZTQ5YjY5YzEsIDB4ZWZiZTQ3ODYsIDB4MGZjMTlkYzYsIDB4MjQwY2ExY2MsIDB4MmRlOTJjNmYsIDB4NGE3NDg0YWEsIDB4NWNiMGE5ZGMsIDB4NzZmOTg4ZGEsXG5cdDB4OTgzZTUxNTIsIDB4YTgzMWM2NmQsIDB4YjAwMzI3YzgsIDB4YmY1OTdmYzcsIDB4YzZlMDBiZjMsIDB4ZDVhNzkxNDcsIDB4MDZjYTYzNTEsIDB4MTQyOTI5NjcsXG5cdDB4MjdiNzBhODUsIDB4MmUxYjIxMzgsIDB4NGQyYzZkZmMsIDB4NTMzODBkMTMsIDB4NjUwYTczNTQsIDB4NzY2YTBhYmIsIDB4ODFjMmM5MmUsIDB4OTI3MjJjODUsXG5cdDB4YTJiZmU4YTEsIDB4YTgxYTY2NGIsIDB4YzI0YjhiNzAsIDB4Yzc2YzUxYTMsIDB4ZDE5MmU4MTksIDB4ZDY5OTA2MjQsIDB4ZjQwZTM1ODUsIDB4MTA2YWEwNzAsXG5cdDB4MTlhNGMxMTYsIDB4MWUzNzZjMDgsIDB4Mjc0ODc3NGMsIDB4MzRiMGJjYjUsIDB4MzkxYzBjYjMsIDB4NGVkOGFhNGEsIDB4NWI5Y2NhNGYsIDB4NjgyZTZmZjMsXG5cdDB4NzQ4ZjgyZWUsIDB4NzhhNTYzNmYsIDB4ODRjODc4MTQsIDB4OGNjNzAyMDgsIDB4OTBiZWZmZmEsIDB4YTQ1MDZjZWIsIDB4YmVmOWEzZjcsIDB4YzY3MTc4ZjJcbl07XG5cbmZ1bmN0aW9uIGN5Y2xlIChzdGF0ZSwgdykge1xuXG5cdC8vIGluaXRpYWxpemUgaGFzaCB2YWx1ZSBmb3IgdGhpcyBjaHVuazpcblx0bGV0IGEgPSBzdGF0ZVswXTtcblx0bGV0IGIgPSBzdGF0ZVsxXTtcblx0bGV0IGMgPSBzdGF0ZVsyXTtcblx0bGV0IGQgPSBzdGF0ZVszXTtcblx0bGV0IGUgPSBzdGF0ZVs0XTtcblx0bGV0IGYgPSBzdGF0ZVs1XTtcblx0bGV0IGcgPSBzdGF0ZVs2XTtcblx0bGV0IGggPSBzdGF0ZVs3XTtcblxuXHQvL01haW4gbG9vcDpcblx0Ly9mb3IgaiBmcm9tIDAgdG8gNjNcblx0Zm9yKGxldCBqID0gMDsgaiA8IDY0OyArK2ope1xuXHRcdC8vUzEgOj0gKGUgcmlnaHRyb3RhdGUgNikgeG9yIChlIHJpZ2h0cm90YXRlIDExKSB4b3IgKGUgcmlnaHRyb3RhdGUgMjUpXG5cdFx0Y29uc3QgczEgPSAoZSA+Pj4gNiB8IGUgPDwgMjYpIF4oZSA+Pj4gMTEgfCBlIDw8IDIxKSBeKGUgPj4+IDI1IHwgZSA8PCA3KTtcblx0XHQvL2NoIDo9IChlIGFuZCBmKSB4b3IgKChub3QgZSkgYW5kIGcpXG5cdFx0Y29uc3QgY2ggPSAoZSAmIGYpIF4gKCh+ZSkgJiBnKTtcblx0XHQvL3RlbXAgOj0gaCArIFMxICsgY2ggKyBrW2pdICsgd1tqXVxuXHRcdGxldCB0ZW1wID0gYWRkMzIoYWRkMzIoaCwgczEpLCBhZGQzMihhZGQzMihjaCwga1tqXSksIHdbal0pKTtcblx0XHQvL2QgOj0gZCArIHRlbXA7XG5cdFx0ZCA9IGFkZDMyKGQsIHRlbXApO1xuXHRcdC8vUzAgOj0gKGEgcmlnaHRyb3RhdGUgMikgeG9yIChhIHJpZ2h0cm90YXRlIDEzKSB4b3IgKGEgcmlnaHRyb3RhdGUgMjIpXG5cdFx0Y29uc3QgczAgPSAoYSA+Pj4gMiB8IGEgPDwgMzApIF4gKGEgPj4+IDEzIHwgYSA8PCAxOSkgXiAoYSA+Pj4gMjIgfCBhIDw8IDEwKTtcblx0XHQvL21haiA6PSAoYSBhbmQgKGIgeG9yIGMpKSB4b3IgKGIgYW5kIGMpXG5cdFx0Y29uc3QgbWFqID0gKGEgJiAoYiBeIGMpKSBeIChiICYgYyk7XG5cdFx0Ly90ZW1wIDo9IHRlbXAgKyBTMCArIG1halxuXHRcdHRlbXAgPSBhZGQzMihhZGQzMih0ZW1wLCBzMCksIG1haik7XG5cblx0XHRoID0gZztcblx0XHRnID0gZjtcblx0XHRmID0gZTtcblx0XHRlID0gZDtcblx0XHRkID0gYztcblx0XHRjID0gYjtcblx0XHRiID0gYTtcblx0XHRhID0gdGVtcDtcblx0fVxuXG5cdC8vIEFkZCB0aGlzIGNodW5rJ3MgaGFzaCB0byByZXN1bHQgc28gZmFyOlxuXHRzdGF0ZVswXSA9IGFkZDMyKHN0YXRlWzBdLCBhKTtcblx0c3RhdGVbMV0gPSBhZGQzMihzdGF0ZVsxXSwgYik7XG5cdHN0YXRlWzJdID0gYWRkMzIoc3RhdGVbMl0sIGMpO1xuXHRzdGF0ZVszXSA9IGFkZDMyKHN0YXRlWzNdLCBkKTtcblx0c3RhdGVbNF0gPSBhZGQzMihzdGF0ZVs0XSwgZSk7XG5cdHN0YXRlWzVdID0gYWRkMzIoc3RhdGVbNV0sIGYpO1xuXHRzdGF0ZVs2XSA9IGFkZDMyKHN0YXRlWzZdLCBnKTtcblx0c3RhdGVbN10gPSBhZGQzMihzdGF0ZVs3XSwgaCk7XG5cbn1cblxuZnVuY3Rpb24gY2FsbCAoaCwgZGF0YSwgbykge1xuXG5cdGNvbnN0IHcgPSBuZXcgQXJyYXkoNjQpO1xuXG5cdC8vIGJyZWFrIGNodW5rIGludG8gc2l4dGVlbiAzMi1iaXQgYmlnLWVuZGlhbiB3b3JkcyB3W2ldLCAwIOKJpCBpIOKJpCAxNVxuXHRmb3IgKGxldCBqID0gMDsgaiA8IDE2OyArK2opIHtcblx0XHR3W2pdID0gYmlnMzIoZGF0YSwgbyArIGogKiA0KTtcblx0fVxuXG5cdC8vIEV4dGVuZCB0aGUgc2l4dGVlbiAzMi1iaXQgd29yZHMgaW50byBzaXh0eS1mb3VyIDMyLWJpdCB3b3Jkczpcblx0Ly8gZm9yIGogZnJvbSAxNiB0byA2M1xuXHRmb3IgKGxldCBqID0gMTY7IGogPCA2NDsgKytqKSB7XG5cdFx0Ly9zMCA6PSAod1tqLTE1XSByaWdodHJvdGF0ZSA3KSB4b3IgKHdbai0xNV0gcmlnaHRyb3RhdGUgMTgpIHhvciAod1tqLTE1XSByaWdodHNoaWZ0IDMpXG5cdFx0Y29uc3QgczAgPSAod1tqLTE1XSA+Pj4gNyB8IHdbai0xNV0gPDwgMjUpIF4gKHdbai0xNV0gPj4+IDE4IHwgd1tqLTE1XSA8PCAxNCkgXiAod1tqLTE1XSA+Pj4gMyk7XG5cdFx0Ly9zMSA6PSAod1tqLTJdIHJpZ2h0cm90YXRlIDE3KSB4b3IgKHdbai0yXSByaWdodHJvdGF0ZSAxOSkgeG9yICh3W2otMl0gcmlnaHRzaGlmdCAxMClcblx0XHRjb25zdCBzMSA9ICh3W2otMl0gPj4+IDE3IHwgd1tqLTJdIDw8IDE1KSBeICh3W2otMl0gPj4+IDE5IHwgd1tqLTJdIDw8IDEzKSBeICh3W2otMl0gPj4+IDEwKTtcblx0XHQvL3dbal0gOj0gd1tqLTE2XSArIHMwICsgd1tqLTddICsgczFcblx0XHR3W2pdID0gYWRkMzIoYWRkMzIod1tqLTE2XSwgczApLCBhZGQzMih3W2otN10sIHMxKSk7XG5cdH1cblxuXHRjeWNsZShoLCB3KTtcblxufVxuXG5cbi8qKlxuICogU0hBLTIyNFxuICpcbiAqIFNIQS0yMjQgaXMgaWRlbnRpY2FsIHRvIFNIQS0yNTYsIGV4Y2VwdCB0aGF0OlxuICogIC0gdGhlIGluaXRpYWwgdmFyaWFibGUgdmFsdWVzIGgwIHRocm91Z2ggaDcgYXJlIGRpZmZlcmVudCwgYW5kXG4gKiAgLSB0aGUgb3V0cHV0IGlzIGNvbnN0cnVjdGVkIGJ5IG9taXR0aW5nIGg3LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhMjI0IChieXRlcywgbiwgZGlnZXN0KSB7XG5cblx0Ly8gUFJFUEFSRVxuXG5cdGNvbnN0IHEgPSBuIC8gOCB8IDA7XG5cdGNvbnN0IHogPSBxICogODtcblx0Y29uc3QgdSA9IG4gLSB6O1xuXG5cdC8vIGFwcGVuZCB0aGUgYml0ICcxJyB0byB0aGUgbWVzc2FnZVxuXHRsZXQgbGFzdCA7XG5cdGlmICh1ID4gMCkge1xuXHRcdGxhc3QgPSBieXRlc1txXSAmICh+MCkgPDwgKDctdSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bGFzdCA9IDB4ODA7XG5cdH1cblxuXG5cblx0Ly8gTm90ZSAxOiBBbGwgdmFyaWFibGVzIGFyZSB1bnNpZ25lZCAzMiBiaXRzIGFuZCB3cmFwIG1vZHVsbyAyXjMyIHdoZW4gY2FsY3VsYXRpbmdcblx0Ly8gTm90ZSAyOiBBbGwgY29uc3RhbnRzIGluIHRoaXMgcHNldWRvIGNvZGUgYXJlIGluIGJpZyBlbmRpYW4uXG5cdC8vIFdpdGhpbiBlYWNoIHdvcmQsIHRoZSBtb3N0IHNpZ25pZmljYW50IGJ5dGUgaXMgc3RvcmVkIGluIHRoZSBsZWZ0bW9zdCBieXRlIHBvc2l0aW9uXG5cblx0Ly8gSW5pdGlhbGl6ZSBzdGF0ZTpcblx0Y29uc3QgaCA9IFsweGMxMDU5ZWQ4LCAweDM2N2NkNTA3LCAweDMwNzBkZDE3LCAweGY3MGU1OTM5LCAweGZmYzAwYjMxLCAweDY4NTgxNTExLCAweDY0Zjk4ZmE3LCAweGJlZmE0ZmE0XTtcblxuXHQvLyBQcm9jZXNzIHRoZSBtZXNzYWdlIGluIHN1Y2Nlc3NpdmUgNTEyLWJpdCBjaHVua3M6XG5cdC8vIGJyZWFrIG1lc3NhZ2UgaW50byA1MTItYml0IGNodW5rc1xuXG5cdGNvbnN0IG0gPSBuIC8gNTEyIHwgMDtcblx0Y29uc3QgeSA9IChuIC0gNTEyICogbSkgLyA4IHwgMDtcblxuXHQvLyBvZmZzZXQgaW4gZGF0YVxuXHRsZXQgbyA9IDA7XG5cblx0Ly8gZm9yIGVhY2ggY2h1bmtcblx0Zm9yIChsZXQgaiA9IDA7IGogPCBtOyArK2osIG8gKz0gNjQpIHtcblx0XHRjYWxsKGgsIGJ5dGVzLCBvKTtcblx0fVxuXG5cdC8vIGxhc3QgYnl0ZXMgKyBwYWRkaW5nICsgbGVuZ3RoXG5cdGxldCB0YWlsID0gW107XG5cblx0Ly8gbGFzdCBieXRlc1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IHk7ICsraikge1xuXHRcdHRhaWwucHVzaChieXRlc1tvICsgal0pO1xuXHR9XG5cblx0Ly8gc3BlY2lhbCBjYXJlIHRha2VuIGZvciB0aGUgdmVyeSBsYXN0IGJ5dGUgd2hpY2ggY291bGRcblx0Ly8gaGF2ZSBiZWVuIG1vZGlmaWVkIGlmIG4gaXMgbm90IGEgbXVsdGlwbGUgb2YgOFxuXHR0YWlsLnB1c2gobGFzdCk7XG5cblxuXHQvLyBhcHBlbmQgMCDiiaQgayA8IDUxMiBiaXRzICcwJywgc28gdGhhdCB0aGUgcmVzdWx0aW5nXG5cdC8vIG1lc3NhZ2UgbGVuZ3RoIChpbiBiaXRzKSBpcyBjb25ncnVlbnQgdG8gNDQ4IChtb2QgNTEyKVxuXHRsZXQgemVyb2VzID0gKDQ0OCAtIChuICsgMSkgJSA1MTIpIC8gOCB8IDA7XG5cblx0aWYgKHplcm9lcyA8IDApIHtcblx0XHQvLyB3ZSBuZWVkIGFuIGFkZGl0aW9uYWwgYmxvY2sgYXMgdGhlcmUgaXNcblx0XHQvLyBub3QgZW5vdWdoIHNwYWNlIGxlZnQgdG8gYXBwZW5kXG5cdFx0Ly8gdGhlIGxlbmd0aCBvZiB0aGUgZGF0YSBpbiBiaXRzXG5cblx0XHRmb3IgKGxldCBqID0gMDsgaiA8IC16ZXJvZXM7ICsraikge1xuXHRcdFx0dGFpbC5wdXNoKDApO1xuXHRcdH1cblxuXHRcdGNhbGwoaCwgdGFpbCwgMCk7XG5cblx0XHR6ZXJvZXMgPSA0NDggLyA4O1xuXHRcdHRhaWwgPSBbXTtcblx0fVxuXG5cblx0Ly8gcGFkIHdpdGggemVyb2VzXG5cdGZvciAobGV0IGogPSAwOyBqIDwgemVyb2VzOyArK2opIHtcblx0XHR0YWlsLnB1c2goMCk7XG5cdH1cblxuXHQvLyBhcHBlbmQgbGVuZ3RoIG9mIG1lc3NhZ2UgKGJlZm9yZSBwcmVwYXJhdGlvbiksIGluIGJpdHMsXG5cdC8vIGFzIDY0LWJpdCBiaWctZW5kaWFuIGludGVnZXJcblxuXHQvLyBKYXZhU2NyaXB0IHdvcmtzIHdpdGggMzIgYml0IGludGVnZXJzLlxuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDU2KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDQ4KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDQwKSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDMyKSAmIDB4ZmYpO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cblx0dGFpbC5wdXNoKChuID4+PiAyNCkgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAxNikgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAgOCkgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAgMCkgJiAweGZmKTtcblxuXHRjYWxsKGgsIHRhaWwsIDApO1xuXG5cdGRpZ2VzdFswXSAgPSAoaFswXSA+Pj4gMjQpICYgMHhmZjtcblx0ZGlnZXN0WzFdICA9IChoWzBdID4+PiAxNikgJiAweGZmO1xuXHRkaWdlc3RbMl0gID0gKGhbMF0gPj4+ICA4KSAmIDB4ZmY7XG5cdGRpZ2VzdFszXSAgPSAoaFswXSA+Pj4gIDApICYgMHhmZjtcblx0ZGlnZXN0WzRdICA9IChoWzFdID4+PiAyNCkgJiAweGZmO1xuXHRkaWdlc3RbNV0gID0gKGhbMV0gPj4+IDE2KSAmIDB4ZmY7XG5cdGRpZ2VzdFs2XSAgPSAoaFsxXSA+Pj4gIDgpICYgMHhmZjtcblx0ZGlnZXN0WzddICA9IChoWzFdID4+PiAgMCkgJiAweGZmO1xuXHRkaWdlc3RbOF0gID0gKGhbMl0gPj4+IDI0KSAmIDB4ZmY7XG5cdGRpZ2VzdFs5XSAgPSAoaFsyXSA+Pj4gMTYpICYgMHhmZjtcblx0ZGlnZXN0WzEwXSA9IChoWzJdID4+PiAgOCkgJiAweGZmO1xuXHRkaWdlc3RbMTFdID0gKGhbMl0gPj4+ICAwKSAmIDB4ZmY7XG5cdGRpZ2VzdFsxMl0gPSAoaFszXSA+Pj4gMjQpICYgMHhmZjtcblx0ZGlnZXN0WzEzXSA9IChoWzNdID4+PiAxNikgJiAweGZmO1xuXHRkaWdlc3RbMTRdID0gKGhbM10gPj4+ICA4KSAmIDB4ZmY7XG5cdGRpZ2VzdFsxNV0gPSAoaFszXSA+Pj4gIDApICYgMHhmZjtcblx0ZGlnZXN0WzE2XSA9IChoWzRdID4+PiAyNCkgJiAweGZmO1xuXHRkaWdlc3RbMTddID0gKGhbNF0gPj4+IDE2KSAmIDB4ZmY7XG5cdGRpZ2VzdFsxOF0gPSAoaFs0XSA+Pj4gIDgpICYgMHhmZjtcblx0ZGlnZXN0WzE5XSA9IChoWzRdID4+PiAgMCkgJiAweGZmO1xuXHRkaWdlc3RbMjBdID0gKGhbNV0gPj4+IDI0KSAmIDB4ZmY7XG5cdGRpZ2VzdFsyMV0gPSAoaFs1XSA+Pj4gMTYpICYgMHhmZjtcblx0ZGlnZXN0WzIyXSA9IChoWzVdID4+PiAgOCkgJiAweGZmO1xuXHRkaWdlc3RbMjNdID0gKGhbNV0gPj4+ICAwKSAmIDB4ZmY7XG5cdGRpZ2VzdFsyNF0gPSAoaFs2XSA+Pj4gMjQpICYgMHhmZjtcblx0ZGlnZXN0WzI1XSA9IChoWzZdID4+PiAxNikgJiAweGZmO1xuXHRkaWdlc3RbMjZdID0gKGhbNl0gPj4+ICA4KSAmIDB4ZmY7XG5cdGRpZ2VzdFsyN10gPSAoaFs2XSA+Pj4gIDApICYgMHhmZjtcblxuXHRyZXR1cm4gZGlnZXN0O1xuXG59XG4iXX0=