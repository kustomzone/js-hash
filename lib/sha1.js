'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sha1 = sha1;

var _jsUint = require('@aureooms/js-uint32');

function cycle(h, w) {

	// initialize hash value for this chunk:
	var a = h[0];
	var b = h[1];
	var c = h[2];
	var d = h[3];
	var e = h[4];

	// Main loop:[35]
	// for j from 0 to 79
	for (var j = 0; j < 80; ++j) {

		var f = void 0,
		    k = void 0;

		// if 0 ≤ j ≤ 19 then
		if (0 <= j && j <= 19) {
			// f = (b and c) or ((not b) and d)
			f = b & c | ~b & d;
			k = 1518500249; // 0x5A827999
		}
		// else if 20 ≤ j ≤ 39
		else if (20 <= j && j <= 39) {
				// f = b xor c xor d
				f = b ^ c ^ d;
				k = 1859775393; // 0x6ED9EBA1
			}
			// else if 40 ≤ j ≤ 59
			else if (40 <= j && j <= 59) {
					// f = (b and c) or (b and d) or (c and d)
					f = b & c | b & d | c & d;
					k = -1894007588; // 0x8F1BBCDC
				}
				// else if 60 ≤ j ≤ 79
				else {
						// f = b xor c xor d
						f = b ^ c ^ d;
						k = -899497514; // 0xCA62C1D6
					}

		// t = (a leftrotate 5) + f + e + k + w[j]
		var t = (0, _jsUint.add32)((0, _jsUint.add32)((0, _jsUint.rotl32)(a, 5), f), (0, _jsUint.add32)((0, _jsUint.add32)(e, k), w[j]));
		e = d;
		d = c;
		// c = b leftrotate 30
		c = (0, _jsUint.rotl32)(b, 30);
		b = a;
		a = t;
	}

	// Add this chunk's hash to result so far:
	h[0] = (0, _jsUint.add32)(h[0], a);
	h[1] = (0, _jsUint.add32)(h[1], b);
	h[2] = (0, _jsUint.add32)(h[2], c);
	h[3] = (0, _jsUint.add32)(h[3], d);
	h[4] = (0, _jsUint.add32)(h[4], e);
}

function call(h, data, o) {

	var w = new Array(80);

	// break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (var j = 0; j < 16; ++j) {
		w[j] = (0, _jsUint.big32)(data, o + j * 4);
	}

	// Extend the sixteen 32-bit words into eighty 32-bit words:
	// for j from 16 to 79
	for (var _j = 16; _j < 80; ++_j) {
		// w[j] = (w[j-3] xor w[j-8] xor w[j-14] xor w[j-16]) leftrotate 1
		var k = w[_j - 3] ^ w[_j - 8] ^ w[_j - 14] ^ w[_j - 16];
		w[_j] = (0, _jsUint.rotl32)(k, 1);
	}

	cycle(h, w);
}

/**
 * SHA1
 */
function sha1(bytes, n, digest) {

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
	var h = [(0, _jsUint.get32)(0x67452301), (0, _jsUint.get32)(0xEFCDAB89), (0, _jsUint.get32)(0x98BADCFE), (0, _jsUint.get32)(0x10325476), (0, _jsUint.get32)(0xC3D2E1F0)];

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
	// tail.push((n >>> 56) & 0xFF);
	// tail.push((n >>> 48) & 0xFF);
	// tail.push((n >>> 40) & 0xFF);
	// tail.push((n >>> 32) & 0xFF);
	tail.push(0);
	tail.push(0);
	tail.push(0);
	tail.push(0);

	tail.push(n >>> 24 & 0xFF);
	tail.push(n >>> 16 & 0xFF);
	tail.push(n >>> 8 & 0xFF);
	tail.push(n >>> 0 & 0xFF);

	call(h, tail, 0);

	digest[0] = h[0] >>> 24 & 0xFF;
	digest[1] = h[0] >>> 16 & 0xFF;
	digest[2] = h[0] >>> 8 & 0xFF;
	digest[3] = h[0] >>> 0 & 0xFF;
	digest[4] = h[1] >>> 24 & 0xFF;
	digest[5] = h[1] >>> 16 & 0xFF;
	digest[6] = h[1] >>> 8 & 0xFF;
	digest[7] = h[1] >>> 0 & 0xFF;
	digest[8] = h[2] >>> 24 & 0xFF;
	digest[9] = h[2] >>> 16 & 0xFF;
	digest[10] = h[2] >>> 8 & 0xFF;
	digest[11] = h[2] >>> 0 & 0xFF;
	digest[12] = h[3] >>> 24 & 0xFF;
	digest[13] = h[3] >>> 16 & 0xFF;
	digest[14] = h[3] >>> 8 & 0xFF;
	digest[15] = h[3] >>> 0 & 0xFF;
	digest[16] = h[4] >>> 24 & 0xFF;
	digest[17] = h[4] >>> 16 & 0xFF;
	digest[18] = h[4] >>> 8 & 0xFF;
	digest[19] = h[4] >>> 0 & 0xFF;

	return digest;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGExLmpzIl0sIm5hbWVzIjpbInNoYTEiLCJjeWNsZSIsImgiLCJ3IiwiYSIsImIiLCJjIiwiZCIsImUiLCJqIiwiZiIsImsiLCJ0IiwiY2FsbCIsImRhdGEiLCJvIiwiQXJyYXkiLCJieXRlcyIsIm4iLCJkaWdlc3QiLCJxIiwieiIsInUiLCJsYXN0IiwibSIsInkiLCJ0YWlsIiwicHVzaCIsInplcm9lcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFvRmdCQSxJLEdBQUFBLEk7O0FBcEZoQjs7QUFFQSxTQUFTQyxLQUFULENBQWdCQyxDQUFoQixFQUFtQkMsQ0FBbkIsRUFBc0I7O0FBRXJCO0FBQ0EsS0FBSUMsSUFBSUYsRUFBRSxDQUFGLENBQVI7QUFDQSxLQUFJRyxJQUFJSCxFQUFFLENBQUYsQ0FBUjtBQUNBLEtBQUlJLElBQUlKLEVBQUUsQ0FBRixDQUFSO0FBQ0EsS0FBSUssSUFBSUwsRUFBRSxDQUFGLENBQVI7QUFDQSxLQUFJTSxJQUFJTixFQUFFLENBQUYsQ0FBUjs7QUFFQTtBQUNBO0FBQ0EsTUFBSyxJQUFJTyxJQUFJLENBQWIsRUFBZ0JBLElBQUksRUFBcEIsRUFBd0IsRUFBRUEsQ0FBMUIsRUFBNkI7O0FBRTVCLE1BQUlDLFVBQUo7QUFBQSxNQUFPQyxVQUFQOztBQUVBO0FBQ0EsTUFBRyxLQUFLRixDQUFMLElBQVVBLEtBQUssRUFBbEIsRUFBcUI7QUFDcEI7QUFDQUMsT0FBS0wsSUFBSUMsQ0FBTCxHQUFZLENBQUVELENBQUgsR0FBUUUsQ0FBdkI7QUFDQUksT0FBSSxVQUFKLENBSG9CLENBR0g7QUFDakI7QUFDRDtBQUxBLE9BTUssSUFBRyxNQUFNRixDQUFOLElBQVdBLEtBQUssRUFBbkIsRUFBc0I7QUFDMUI7QUFDQUMsUUFBSUwsSUFBSUMsQ0FBSixHQUFRQyxDQUFaO0FBQ0FJLFFBQUksVUFBSixDQUgwQixDQUdUO0FBQ2pCO0FBQ0Q7QUFMSyxRQU1BLElBQUcsTUFBTUYsQ0FBTixJQUFXQSxLQUFLLEVBQW5CLEVBQXNC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Q0FpQixRQUFPLEVBQVAsSUFBY2pCLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7QUFDQWlCLFFBQU8sRUFBUCxJQUFjakIsRUFBRSxDQUFGLE1BQVUsQ0FBWCxHQUFnQixJQUE3QjtBQUNBaUIsUUFBTyxFQUFQLElBQWNqQixFQUFFLENBQUYsTUFBUyxFQUFWLEdBQWdCLElBQTdCO0FBQ0FpQixRQUFPLEVBQVAsSUFBY2pCLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWlCLFFBQU8sRUFBUCxJQUFjakIsRUFBRSxDQUFGLE1BQVUsQ0FBWCxHQUFnQixJQUE3QjtBQUNBaUIsUUFBTyxFQUFQLElBQWNqQixFQUFFLENBQUYsTUFBVSxDQUFYLEdBQWdCLElBQTdCO0FBQ0FpQixRQUFPLEVBQVAsSUFBY2pCLEVBQUUsQ0FBRixNQUFTLEVBQVYsR0FBZ0IsSUFBN0I7QUFDQWlCLFFBQU8sRUFBUCxJQUFjakIsRUFBRSxDQUFGLE1BQVMsRUFBVixHQUFnQixJQUE3QjtBQUNBaUIsUUFBTyxFQUFQLElBQWNqQixFQUFFLENBQUYsTUFBVSxDQUFYLEdBQWdCLElBQTdCO0FBQ0FpQixRQUFPLEVBQVAsSUFBY2pCLEVBQUUsQ0FBRixNQUFVLENBQVgsR0FBZ0IsSUFBN0I7O0FBRUEsUUFBT2lCLE1BQVA7QUFFQSIsImZpbGUiOiJzaGExLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0MzIgLCBiaWczMiAsIHJvdGwzMiAsIGFkZDMyIH0gZnJvbSAnQGF1cmVvb21zL2pzLXVpbnQzMicgO1xuXG5mdW5jdGlvbiBjeWNsZSAoaCwgdykge1xuXG5cdC8vIGluaXRpYWxpemUgaGFzaCB2YWx1ZSBmb3IgdGhpcyBjaHVuazpcblx0bGV0IGEgPSBoWzBdO1xuXHRsZXQgYiA9IGhbMV07XG5cdGxldCBjID0gaFsyXTtcblx0bGV0IGQgPSBoWzNdO1xuXHRsZXQgZSA9IGhbNF07XG5cblx0Ly8gTWFpbiBsb29wOlszNV1cblx0Ly8gZm9yIGogZnJvbSAwIHRvIDc5XG5cdGZvciAobGV0IGogPSAwOyBqIDwgODA7ICsraikge1xuXG5cdFx0bGV0IGYsIGs7XG5cblx0XHQvLyBpZiAwIOKJpCBqIOKJpCAxOSB0aGVuXG5cdFx0aWYoMCA8PSBqICYmIGogPD0gMTkpe1xuXHRcdFx0Ly8gZiA9IChiIGFuZCBjKSBvciAoKG5vdCBiKSBhbmQgZClcblx0XHRcdGYgPSAoYiAmIGMpIHwgKCh+IGIpICYgZCk7XG5cdFx0XHRrID0gMTUxODUwMDI0OSA7IC8vIDB4NUE4Mjc5OTlcblx0XHR9XG5cdFx0Ly8gZWxzZSBpZiAyMCDiiaQgaiDiiaQgMzlcblx0XHRlbHNlIGlmKDIwIDw9IGogJiYgaiA8PSAzOSl7XG5cdFx0XHQvLyBmID0gYiB4b3IgYyB4b3IgZFxuXHRcdFx0ZiA9IGIgXiBjIF4gZDtcblx0XHRcdGsgPSAxODU5Nzc1MzkzIDsgLy8gMHg2RUQ5RUJBMVxuXHRcdH1cblx0XHQvLyBlbHNlIGlmIDQwIOKJpCBqIOKJpCA1OVxuXHRcdGVsc2UgaWYoNDAgPD0gaiAmJiBqIDw9IDU5KXtcblx0XHRcdC8vIGYgPSAoYiBhbmQgYykgb3IgKGIgYW5kIGQpIG9yIChjIGFuZCBkKVxuXHRcdFx0ZiA9IChiICYgYykgfCAoYiAmIGQpIHwgKGMgJiBkKTtcblx0XHRcdGsgPSAtMTg5NDAwNzU4OCA7IC8vIDB4OEYxQkJDRENcblx0XHR9XG5cdFx0Ly8gZWxzZSBpZiA2MCDiiaQgaiDiiaQgNzlcblx0XHRlbHNle1xuXHRcdFx0Ly8gZiA9IGIgeG9yIGMgeG9yIGRcblx0XHRcdGYgPSBiIF4gYyBeIGQ7XG5cdFx0XHRrID0gLTg5OTQ5NzUxNCA7IC8vIDB4Q0E2MkMxRDZcblx0XHR9XG5cblx0XHQvLyB0ID0gKGEgbGVmdHJvdGF0ZSA1KSArIGYgKyBlICsgayArIHdbal1cblx0XHRjb25zdCB0ID0gYWRkMzIoYWRkMzIocm90bDMyKGEsIDUpLCBmKSwgYWRkMzIoYWRkMzIoZSwgayksIHdbal0pKTtcblx0XHRlID0gZDtcblx0XHRkID0gYztcblx0XHQvLyBjID0gYiBsZWZ0cm90YXRlIDMwXG5cdFx0YyA9IHJvdGwzMihiLCAzMCk7XG5cdFx0YiA9IGE7XG5cdFx0YSA9IHQ7XG5cdH1cblxuXHQvLyBBZGQgdGhpcyBjaHVuaydzIGhhc2ggdG8gcmVzdWx0IHNvIGZhcjpcblx0aFswXSA9IGFkZDMyKGhbMF0sIGEpO1xuXHRoWzFdID0gYWRkMzIoaFsxXSwgYik7XG5cdGhbMl0gPSBhZGQzMihoWzJdLCBjKTtcblx0aFszXSA9IGFkZDMyKGhbM10sIGQpO1xuXHRoWzRdID0gYWRkMzIoaFs0XSwgZSk7XG59XG5cbmZ1bmN0aW9uIGNhbGwgKGgsIGRhdGEsIG8pIHtcblxuXHRjb25zdCB3ID0gbmV3IEFycmF5KDgwKTtcblxuXHQvLyBicmVhayBjaHVuayBpbnRvIHNpeHRlZW4gMzItYml0IGJpZy1lbmRpYW4gd29yZHMgd1tpXSwgMCDiiaQgaSDiiaQgMTVcblx0Zm9yIChsZXQgaiA9IDA7IGogPCAxNjsgKytqKSB7XG5cdFx0d1tqXSA9IGJpZzMyKGRhdGEsIG8gKyBqICogNCk7XG5cdH1cblxuXHQvLyBFeHRlbmQgdGhlIHNpeHRlZW4gMzItYml0IHdvcmRzIGludG8gZWlnaHR5IDMyLWJpdCB3b3Jkczpcblx0Ly8gZm9yIGogZnJvbSAxNiB0byA3OVxuXHRmb3IobGV0IGogPSAxNjsgaiA8IDgwOyArK2ope1xuXHRcdC8vIHdbal0gPSAod1tqLTNdIHhvciB3W2otOF0geG9yIHdbai0xNF0geG9yIHdbai0xNl0pIGxlZnRyb3RhdGUgMVxuXHRcdGNvbnN0IGsgPSAod1tqLTNdIF4gd1tqLThdIF4gd1tqLTE0XSBeIHdbai0xNl0pO1xuXHRcdHdbal0gPSByb3RsMzIoaywgMSk7XG5cdH1cblxuXHRjeWNsZShoLCB3KTtcblxufVxuXG4vKipcbiAqIFNIQTFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoYTEgKGJ5dGVzLCBuLCBkaWdlc3QpIHtcblxuXHQvLyBQUkVQQVJFXG5cblx0Y29uc3QgcSA9IG4gLyA4IHwgMDtcblx0Y29uc3QgeiA9IHEgKiA4O1xuXHRjb25zdCB1ID0gbiAtIHo7XG5cblx0Ly8gYXBwZW5kIHRoZSBiaXQgJzEnIHRvIHRoZSBtZXNzYWdlXG5cdGxldCBsYXN0IDtcblx0aWYgKHUgPiAwKSB7XG5cdFx0bGFzdCA9IGJ5dGVzW3FdICYgKH4wKSA8PCAoNy11KTtcblx0fVxuXHRlbHNlIHtcblx0XHRsYXN0ID0gMHg4MDtcblx0fVxuXG5cdC8vIE5vdGUgMTogQWxsIHZhcmlhYmxlcyBhcmUgdW5zaWduZWQgMzIgYml0cyBhbmQgd3JhcCBtb2R1bG8gMl4zMiB3aGVuIGNhbGN1bGF0aW5nXG5cdC8vIE5vdGUgMjogQWxsIGNvbnN0YW50cyBpbiB0aGlzIHBzZXVkbyBjb2RlIGFyZSBpbiBiaWcgZW5kaWFuLlxuXHQvLyBXaXRoaW4gZWFjaCB3b3JkLCB0aGUgbW9zdCBzaWduaWZpY2FudCBieXRlIGlzIHN0b3JlZCBpbiB0aGUgbGVmdG1vc3QgYnl0ZSBwb3NpdGlvblxuXG5cdC8vIEluaXRpYWxpemUgc3RhdGU6XG5cdGNvbnN0IGggPSBbXG5cdFx0Z2V0MzIoMHg2NzQ1MjMwMSksXG5cdFx0Z2V0MzIoMHhFRkNEQUI4OSksXG5cdFx0Z2V0MzIoMHg5OEJBRENGRSksXG5cdFx0Z2V0MzIoMHgxMDMyNTQ3NiksXG5cdFx0Z2V0MzIoMHhDM0QyRTFGMCksXG5cdF0gO1xuXG5cdC8vIFByb2Nlc3MgdGhlIG1lc3NhZ2UgaW4gc3VjY2Vzc2l2ZSA1MTItYml0IGNodW5rczpcblx0Ly8gYnJlYWsgbWVzc2FnZSBpbnRvIDUxMi1iaXQgY2h1bmtzXG5cblx0Y29uc3QgbSA9IG4gLyA1MTIgfCAwO1xuXHRjb25zdCB5ID0gKG4gLSA1MTIgKiBtKSAvIDggfCAwO1xuXG5cdC8vIG9mZnNldCBpbiBkYXRhXG5cdGxldCBvID0gMDtcblxuXHQvLyBmb3IgZWFjaCBjaHVua1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IG07ICsraiwgbyArPSA2NCkge1xuXHRcdGNhbGwoaCwgYnl0ZXMsIG8pO1xuXHR9XG5cblx0Ly8gbGFzdCBieXRlcyArIHBhZGRpbmcgKyBsZW5ndGhcblx0bGV0IHRhaWwgPSBbXTtcblxuXHQvLyBsYXN0IGJ5dGVzXG5cdGZvciAobGV0IGogPSAwOyBqIDwgeTsgKytqKSB7XG5cdFx0dGFpbC5wdXNoKGJ5dGVzW28gKyBqXSk7XG5cdH1cblxuXHQvLyBzcGVjaWFsIGNhcmUgdGFrZW4gZm9yIHRoZSB2ZXJ5IGxhc3QgYnl0ZSB3aGljaCBjb3VsZFxuXHQvLyBoYXZlIGJlZW4gbW9kaWZpZWQgaWYgbiBpcyBub3QgYSBtdWx0aXBsZSBvZiA4XG5cdHRhaWwucHVzaChsYXN0KTtcblxuXG5cdC8vIGFwcGVuZCAwIOKJpCBrIDwgNTEyIGJpdHMgJzAnLCBzbyB0aGF0IHRoZSByZXN1bHRpbmdcblx0Ly8gbWVzc2FnZSBsZW5ndGggKGluIGJpdHMpIGlzIGNvbmdydWVudCB0byA0NDggKG1vZCA1MTIpXG5cdGxldCB6ZXJvZXMgPSAoNDQ4IC0gKG4gKyAxKSAlIDUxMikgLyA4IHwgMDtcblxuXHRpZiAoemVyb2VzIDwgMCkge1xuXHRcdC8vIHdlIG5lZWQgYW4gYWRkaXRpb25hbCBibG9jayBhcyB0aGVyZSBpc1xuXHRcdC8vIG5vdCBlbm91Z2ggc3BhY2UgbGVmdCB0byBhcHBlbmRcblx0XHQvLyB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhIGluIGJpdHNcblxuXHRcdGZvciAobGV0IGogPSAwOyBqIDwgLXplcm9lczsgKytqKSB7XG5cdFx0XHR0YWlsLnB1c2goMCk7XG5cdFx0fVxuXG5cdFx0Y2FsbChoLCB0YWlsLCAwKTtcblxuXHRcdHplcm9lcyA9IDQ0OCAvIDg7XG5cdFx0dGFpbCA9IFtdO1xuXHR9XG5cblxuXHQvLyBwYWQgd2l0aCB6ZXJvZXNcblx0Zm9yIChsZXQgaiA9IDA7IGogPCB6ZXJvZXM7ICsraikge1xuXHRcdHRhaWwucHVzaCgwKTtcblx0fVxuXG5cdC8vIGFwcGVuZCBsZW5ndGggb2YgbWVzc2FnZSAoYmVmb3JlIHByZXBhcmF0aW9uKSwgaW4gYml0cyxcblx0Ly8gYXMgNjQtYml0IGJpZy1lbmRpYW4gaW50ZWdlclxuXG5cdC8vIEphdmFTY3JpcHQgd29ya3Mgd2l0aCAzMiBiaXQgaW50ZWdlcnMuXG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNTYpICYgMHhGRik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNDgpICYgMHhGRik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNDApICYgMHhGRik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gMzIpICYgMHhGRik7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblxuXHR0YWlsLnB1c2goKG4gPj4+IDI0KSAmIDB4RkYpO1xuXHR0YWlsLnB1c2goKG4gPj4+IDE2KSAmIDB4RkYpO1xuXHR0YWlsLnB1c2goKG4gPj4+ICA4KSAmIDB4RkYpO1xuXHR0YWlsLnB1c2goKG4gPj4+ICAwKSAmIDB4RkYpO1xuXG5cdGNhbGwoaCwgdGFpbCwgMCk7XG5cblx0ZGlnZXN0WzBdICA9IChoWzBdID4+PiAyNCkgJiAweEZGO1xuXHRkaWdlc3RbMV0gID0gKGhbMF0gPj4+IDE2KSAmIDB4RkY7XG5cdGRpZ2VzdFsyXSAgPSAoaFswXSA+Pj4gIDgpICYgMHhGRjtcblx0ZGlnZXN0WzNdICA9IChoWzBdID4+PiAgMCkgJiAweEZGO1xuXHRkaWdlc3RbNF0gID0gKGhbMV0gPj4+IDI0KSAmIDB4RkY7XG5cdGRpZ2VzdFs1XSAgPSAoaFsxXSA+Pj4gMTYpICYgMHhGRjtcblx0ZGlnZXN0WzZdICA9IChoWzFdID4+PiAgOCkgJiAweEZGO1xuXHRkaWdlc3RbN10gID0gKGhbMV0gPj4+ICAwKSAmIDB4RkY7XG5cdGRpZ2VzdFs4XSAgPSAoaFsyXSA+Pj4gMjQpICYgMHhGRjtcblx0ZGlnZXN0WzldICA9IChoWzJdID4+PiAxNikgJiAweEZGO1xuXHRkaWdlc3RbMTBdID0gKGhbMl0gPj4+ICA4KSAmIDB4RkY7XG5cdGRpZ2VzdFsxMV0gPSAoaFsyXSA+Pj4gIDApICYgMHhGRjtcblx0ZGlnZXN0WzEyXSA9IChoWzNdID4+PiAyNCkgJiAweEZGO1xuXHRkaWdlc3RbMTNdID0gKGhbM10gPj4+IDE2KSAmIDB4RkY7XG5cdGRpZ2VzdFsxNF0gPSAoaFszXSA+Pj4gIDgpICYgMHhGRjtcblx0ZGlnZXN0WzE1XSA9IChoWzNdID4+PiAgMCkgJiAweEZGO1xuXHRkaWdlc3RbMTZdID0gKGhbNF0gPj4+IDI0KSAmIDB4RkY7XG5cdGRpZ2VzdFsxN10gPSAoaFs0XSA+Pj4gMTYpICYgMHhGRjtcblx0ZGlnZXN0WzE4XSA9IChoWzRdID4+PiAgOCkgJiAweEZGO1xuXHRkaWdlc3RbMTldID0gKGhbNF0gPj4+ICAwKSAmIDB4RkY7XG5cblx0cmV0dXJuIGRpZ2VzdDtcblxufVxuIl19