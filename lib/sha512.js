'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.sha512 = sha512;

var _jsUint = require('@aureooms/js-uint64');

// Initialize table of round constants
// (first 64 bits of the fractional parts of the cube roots of the first 80 primes 2..311):
var k = [(0, _jsUint.get64)(0x428a2f98, 0xd728ae22), (0, _jsUint.get64)(0x71374491, 0x23ef65cd), (0, _jsUint.get64)(0xb5c0fbcf, 0xec4d3b2f), (0, _jsUint.get64)(0xe9b5dba5, 0x8189dbbc), (0, _jsUint.get64)(0x3956c25b, 0xf348b538), (0, _jsUint.get64)(0x59f111f1, 0xb605d019), (0, _jsUint.get64)(0x923f82a4, 0xaf194f9b), (0, _jsUint.get64)(0xab1c5ed5, 0xda6d8118), (0, _jsUint.get64)(0xd807aa98, 0xa3030242), (0, _jsUint.get64)(0x12835b01, 0x45706fbe), (0, _jsUint.get64)(0x243185be, 0x4ee4b28c), (0, _jsUint.get64)(0x550c7dc3, 0xd5ffb4e2), (0, _jsUint.get64)(0x72be5d74, 0xf27b896f), (0, _jsUint.get64)(0x80deb1fe, 0x3b1696b1), (0, _jsUint.get64)(0x9bdc06a7, 0x25c71235), (0, _jsUint.get64)(0xc19bf174, 0xcf692694), (0, _jsUint.get64)(0xe49b69c1, 0x9ef14ad2), (0, _jsUint.get64)(0xefbe4786, 0x384f25e3), (0, _jsUint.get64)(0x0fc19dc6, 0x8b8cd5b5), (0, _jsUint.get64)(0x240ca1cc, 0x77ac9c65), (0, _jsUint.get64)(0x2de92c6f, 0x592b0275), (0, _jsUint.get64)(0x4a7484aa, 0x6ea6e483), (0, _jsUint.get64)(0x5cb0a9dc, 0xbd41fbd4), (0, _jsUint.get64)(0x76f988da, 0x831153b5), (0, _jsUint.get64)(0x983e5152, 0xee66dfab), (0, _jsUint.get64)(0xa831c66d, 0x2db43210), (0, _jsUint.get64)(0xb00327c8, 0x98fb213f), (0, _jsUint.get64)(0xbf597fc7, 0xbeef0ee4), (0, _jsUint.get64)(0xc6e00bf3, 0x3da88fc2), (0, _jsUint.get64)(0xd5a79147, 0x930aa725), (0, _jsUint.get64)(0x06ca6351, 0xe003826f), (0, _jsUint.get64)(0x14292967, 0x0a0e6e70), (0, _jsUint.get64)(0x27b70a85, 0x46d22ffc), (0, _jsUint.get64)(0x2e1b2138, 0x5c26c926), (0, _jsUint.get64)(0x4d2c6dfc, 0x5ac42aed), (0, _jsUint.get64)(0x53380d13, 0x9d95b3df), (0, _jsUint.get64)(0x650a7354, 0x8baf63de), (0, _jsUint.get64)(0x766a0abb, 0x3c77b2a8), (0, _jsUint.get64)(0x81c2c92e, 0x47edaee6), (0, _jsUint.get64)(0x92722c85, 0x1482353b), (0, _jsUint.get64)(0xa2bfe8a1, 0x4cf10364), (0, _jsUint.get64)(0xa81a664b, 0xbc423001), (0, _jsUint.get64)(0xc24b8b70, 0xd0f89791), (0, _jsUint.get64)(0xc76c51a3, 0x0654be30), (0, _jsUint.get64)(0xd192e819, 0xd6ef5218), (0, _jsUint.get64)(0xd6990624, 0x5565a910), (0, _jsUint.get64)(0xf40e3585, 0x5771202a), (0, _jsUint.get64)(0x106aa070, 0x32bbd1b8), (0, _jsUint.get64)(0x19a4c116, 0xb8d2d0c8), (0, _jsUint.get64)(0x1e376c08, 0x5141ab53), (0, _jsUint.get64)(0x2748774c, 0xdf8eeb99), (0, _jsUint.get64)(0x34b0bcb5, 0xe19b48a8), (0, _jsUint.get64)(0x391c0cb3, 0xc5c95a63), (0, _jsUint.get64)(0x4ed8aa4a, 0xe3418acb), (0, _jsUint.get64)(0x5b9cca4f, 0x7763e373), (0, _jsUint.get64)(0x682e6ff3, 0xd6b2b8a3), (0, _jsUint.get64)(0x748f82ee, 0x5defb2fc), (0, _jsUint.get64)(0x78a5636f, 0x43172f60), (0, _jsUint.get64)(0x84c87814, 0xa1f0ab72), (0, _jsUint.get64)(0x8cc70208, 0x1a6439ec), (0, _jsUint.get64)(0x90befffa, 0x23631e28), (0, _jsUint.get64)(0xa4506ceb, 0xde82bde9), (0, _jsUint.get64)(0xbef9a3f7, 0xb2c67915), (0, _jsUint.get64)(0xc67178f2, 0xe372532b), (0, _jsUint.get64)(0xca273ece, 0xea26619c), (0, _jsUint.get64)(0xd186b8c7, 0x21c0c207), (0, _jsUint.get64)(0xeada7dd6, 0xcde0eb1e), (0, _jsUint.get64)(0xf57d4f7f, 0xee6ed178), (0, _jsUint.get64)(0x06f067aa, 0x72176fba), (0, _jsUint.get64)(0x0a637dc5, 0xa2c898a6), (0, _jsUint.get64)(0x113f9804, 0xbef90dae), (0, _jsUint.get64)(0x1b710b35, 0x131c471b), (0, _jsUint.get64)(0x28db77f5, 0x23047d84), (0, _jsUint.get64)(0x32caab7b, 0x40c72493), (0, _jsUint.get64)(0x3c9ebe0a, 0x15c9bebc), (0, _jsUint.get64)(0x431d67c4, 0x9c100d4c), (0, _jsUint.get64)(0x4cc5d4be, 0xcb3e42b6), (0, _jsUint.get64)(0x597f299c, 0xfc657e2a), (0, _jsUint.get64)(0x5fcb6fab, 0x3ad6faec), (0, _jsUint.get64)(0x6c44198c, 0x4a475817)];

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
		var s1 = (0, _jsUint.xor64)((0, _jsUint.xor64)((0, _jsUint.rotr64)(e, 14), (0, _jsUint.rotr64)(e, 18)), (0, _jsUint.rotr64)(e, 41));
		// ch := (e and f) xor ((not e) and g)
		var ch = (0, _jsUint.xor64)((0, _jsUint.and64)(e, f), (0, _jsUint.and64)((0, _jsUint.not64)(e), g));
		// temp := h + S1 + ch + k[j] + w[j]
		var temp = (0, _jsUint.add64)((0, _jsUint.add64)(h, s1), (0, _jsUint.add64)((0, _jsUint.add64)(ch, k[j]), w[j]));
		// d := d + temp;
		d = (0, _jsUint.add64)(d, temp);
		// S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
		var s0 = (0, _jsUint.xor64)((0, _jsUint.xor64)((0, _jsUint.rotr64)(a, 28), (0, _jsUint.rotr64)(a, 34)), (0, _jsUint.rotr64)(a, 39));
		// maj := (a and (b xor c)) xor (b and c)
		var maj = (0, _jsUint.xor64)((0, _jsUint.and64)(a, (0, _jsUint.xor64)(b, c)), (0, _jsUint.and64)(b, c));
		// temp := temp + S0 + maj
		temp = (0, _jsUint.add64)((0, _jsUint.add64)(temp, s0), maj);

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
	state[0] = (0, _jsUint.add64)(state[0], a);
	state[1] = (0, _jsUint.add64)(state[1], b);
	state[2] = (0, _jsUint.add64)(state[2], c);
	state[3] = (0, _jsUint.add64)(state[3], d);
	state[4] = (0, _jsUint.add64)(state[4], e);
	state[5] = (0, _jsUint.add64)(state[5], f);
	state[6] = (0, _jsUint.add64)(state[6], g);
	state[7] = (0, _jsUint.add64)(state[7], h);
}

function call(h, data, o) {

	var w = new Array(80);

	// break chunk into sixteen 64-bit big-endian words w[i], 0 ≤ i ≤ 15
	for (var j = 0; j < 16; ++j) {
		w[j] = (0, _jsUint.big64)(data, o + j * 8);
	}

	// Extend the sixteen 64-bit words into 80 64-bit words:
	// for j from 16 to 79
	for (var _j = 16; _j < 80; ++_j) {
		// s0 := (w[j-15] rightrotate 1) xor (w[j-15] rightrotate 8) xor (w[j-15] rightshift 7)
		var s0 = (0, _jsUint.xor64)((0, _jsUint.xor64)((0, _jsUint.rotr64)(w[_j - 15], 1), (0, _jsUint.rotr64)(w[_j - 15], 8)), (0, _jsUint.shr64)(w[_j - 15], 7));
		// s1 := (w[j-2] rightrotate 19) xor (w[j-2] rightrotate 61) xor (w[j-2] rightshift 6)
		var s1 = (0, _jsUint.xor64)((0, _jsUint.xor64)((0, _jsUint.rotr64)(w[_j - 2], 19), (0, _jsUint.rotr64)(w[_j - 2], 61)), (0, _jsUint.shr64)(w[_j - 2], 6));
		// w[j] := w[j-16] + s0 + w[j-7] + s1
		w[_j] = (0, _jsUint.add64)((0, _jsUint.add64)(w[_j - 16], s0), (0, _jsUint.add64)(w[_j - 7], s1));
	}

	cycle(h, w);
}

/**
 * SHA-512
 */
function sha512(bytes, n, digest) {

	// Note 1: All variables are unsigned 64 bits and wrap modulo 2^64 when calculating
	// Note 2: All constants in this pseudo code are big endian

	// Initialize variables
	// (first 64 bits of the fractional parts of the square roots of the first 8 primes 2..19):
	var h = [(0, _jsUint.get64)(0x6a09e667, 0xf3bcc908), (0, _jsUint.get64)(0xbb67ae85, 0x84caa73b), (0, _jsUint.get64)(0x3c6ef372, 0xfe94f82b), (0, _jsUint.get64)(0xa54ff53a, 0x5f1d36f1), (0, _jsUint.get64)(0x510e527f, 0xade682d1), (0, _jsUint.get64)(0x9b05688c, 0x2b3e6c1f), (0, _jsUint.get64)(0x1f83d9ab, 0xfb41bd6b), (0, _jsUint.get64)(0x5be0cd19, 0x137e2179)];

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

	for (var i = 0, _j5 = 0; _j5 < 8; ++_j5) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGE1MTIuanMiXSwibmFtZXMiOlsic2hhNTEyIiwiayIsImN5Y2xlIiwic3RhdGUiLCJ3IiwiYSIsImIiLCJjIiwiZCIsImUiLCJmIiwiZyIsImgiLCJqIiwiczEiLCJjaCIsInRlbXAiLCJzMCIsIm1haiIsImNhbGwiLCJkYXRhIiwibyIsIkFycmF5IiwiYnl0ZXMiLCJuIiwiZGlnZXN0IiwicSIsInoiLCJ1IiwibGFzdCIsIm0iLCJ5IiwidGFpbCIsInB1c2giLCJ6ZXJvZXMiLCJpIl0sIm1hcHBpbmdzIjoiOzs7OztRQTBHZ0JBLE0sR0FBQUEsTTs7QUExR2hCOztBQUVBO0FBQ0E7QUFDQSxJQUFNQyxJQUFJLENBQ1QsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQURTLEVBQ3NCLG1CQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FEdEIsRUFDcUQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQURyRCxFQUNvRixtQkFBTSxVQUFOLEVBQWtCLFVBQWxCLENBRHBGLEVBRVQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUZTLEVBRXNCLG1CQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FGdEIsRUFFcUQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUZyRCxFQUVvRixtQkFBTSxVQUFOLEVBQWtCLFVBQWxCLENBRnBGLEVBR1QsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUhTLEVBR3NCLG1CQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FIdEIsRUFHcUQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUhyRCxFQUdvRixtQkFBTSxVQUFOLEVBQWtCLFVBQWxCLENBSHBGLEVBSVQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUpTLEVBSXNCLG1CQUFNLFVBQU4sRUFBa0IsVUFBbEIsQ0FKdEIsRUFJcUQsbUJBQU0sVUFBTixFQUFrQixVQUFsQixDQUpyRCxFQUlvRixtQkFBTSxVQUFOLEVBQWtCLFVBQWxCLENBSnBGLEVBS1QsbUJBQU0sVUFBTixFQUFrQixVQUFs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SUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFZLEVBQWIsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFhLENBQWQsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFhLENBQWQsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFZLEVBQWIsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFZLEVBQWIsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFhLENBQWQsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBVixTQUFPVSxDQUFQLElBQWF2QixFQUFFQyxHQUFGLEVBQUssQ0FBTCxNQUFhLENBQWQsR0FBbUIsSUFBL0I7QUFDQSxJQUFFc0IsQ0FBRjtBQUNBOztBQUVELFFBQU9WLE1BQVA7QUFFQSIsImZpbGUiOiJzaGE1MTIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXQ2NCAsIGFkZDY0ICwgYW5kNjQgLCB4b3I2NCAsIHJvdHI2NCAsIG5vdDY0ICwgYmlnNjQgLCBzaHI2NCB9IGZyb20gJ0BhdXJlb29tcy9qcy11aW50NjQnIDtcblxuLy8gSW5pdGlhbGl6ZSB0YWJsZSBvZiByb3VuZCBjb25zdGFudHNcbi8vIChmaXJzdCA2NCBiaXRzIG9mIHRoZSBmcmFjdGlvbmFsIHBhcnRzIG9mIHRoZSBjdWJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4MCBwcmltZXMgMi4uMzExKTpcbmNvbnN0IGsgPSBbXG5cdGdldDY0KDB4NDI4YTJmOTgsIDB4ZDcyOGFlMjIpLCBnZXQ2NCgweDcxMzc0NDkxLCAweDIzZWY2NWNkKSwgZ2V0NjQoMHhiNWMwZmJjZiwgMHhlYzRkM2IyZiksIGdldDY0KDB4ZTliNWRiYTUsIDB4ODE4OWRiYmMpLFxuXHRnZXQ2NCgweDM5NTZjMjViLCAweGYzNDhiNTM4KSwgZ2V0NjQoMHg1OWYxMTFmMSwgMHhiNjA1ZDAxOSksIGdldDY0KDB4OTIzZjgyYTQsIDB4YWYxOTRmOWIpLCBnZXQ2NCgweGFiMWM1ZWQ1LCAweGRhNmQ4MTE4KSxcblx0Z2V0NjQoMHhkODA3YWE5OCwgMHhhMzAzMDI0MiksIGdldDY0KDB4MTI4MzViMDEsIDB4NDU3MDZmYmUpLCBnZXQ2NCgweDI0MzE4NWJlLCAweDRlZTRiMjhjKSwgZ2V0NjQoMHg1NTBjN2RjMywgMHhkNWZmYjRlMiksXG5cdGdldDY0KDB4NzJiZTVkNzQsIDB4ZjI3Yjg5NmYpLCBnZXQ2NCgweDgwZGViMWZlLCAweDNiMTY5NmIxKSwgZ2V0NjQoMHg5YmRjMDZhNywgMHgyNWM3MTIzNSksIGdldDY0KDB4YzE5YmYxNzQsIDB4Y2Y2OTI2OTQpLFxuXHRnZXQ2NCgweGU0OWI2OWMxLCAweDllZjE0YWQyKSwgZ2V0NjQoMHhlZmJlNDc4NiwgMHgzODRmMjVlMyksIGdldDY0KDB4MGZjMTlkYzYsIDB4OGI4Y2Q1YjUpLCBnZXQ2NCgweDI0MGNhMWNjLCAweDc3YWM5YzY1KSxcblx0Z2V0NjQoMHgyZGU5MmM2ZiwgMHg1OTJiMDI3NSksIGdldDY0KDB4NGE3NDg0YWEsIDB4NmVhNmU0ODMpLCBnZXQ2NCgweDVjYjBhOWRjLCAweGJkNDFmYmQ0KSwgZ2V0NjQoMHg3NmY5ODhkYSwgMHg4MzExNTNiNSksXG5cdGdldDY0KDB4OTgzZTUxNTIsIDB4ZWU2NmRmYWIpLCBnZXQ2NCgweGE4MzFjNjZkLCAweDJkYjQzMjEwKSwgZ2V0NjQoMHhiMDAzMjdjOCwgMHg5OGZiMjEzZiksIGdldDY0KDB4YmY1OTdmYzcsIDB4YmVlZjBlZTQpLFxuXHRnZXQ2NCgweGM2ZTAwYmYzLCAweDNkYTg4ZmMyKSwgZ2V0NjQoMHhkNWE3OTE0NywgMHg5MzBhYTcyNSksIGdldDY0KDB4MDZjYTYzNTEsIDB4ZTAwMzgyNmYpLCBnZXQ2NCgweDE0MjkyOTY3LCAweDBhMGU2ZTcwKSxcblx0Z2V0NjQoMHgyN2I3MGE4NSwgMHg0NmQyMmZmYyksIGdldDY0KDB4MmUxYjIxMzgsIDB4NWMyNmM5MjYpLCBnZXQ2NCgweDRkMmM2ZGZjLCAweDVhYzQyYWVkKSwgZ2V0NjQoMHg1MzM4MGQxMywgMHg5ZDk1YjNkZiksXG5cdGdldDY0KDB4NjUwYTczNTQsIDB4OGJhZjYzZGUpLCBnZXQ2NCgweDc2NmEwYWJiLCAweDNjNzdiMmE4KSwgZ2V0NjQoMHg4MWMyYzkyZSwgMHg0N2VkYWVlNiksIGdldDY0KDB4OTI3MjJjODUsIDB4MTQ4MjM1M2IpLFxuXHRnZXQ2NCgweGEyYmZlOGExLCAweDRjZjEwMzY0KSwgZ2V0NjQoMHhhODFhNjY0YiwgMHhiYzQyMzAwMSksIGdldDY0KDB4YzI0YjhiNzAsIDB4ZDBmODk3OTEpLCBnZXQ2NCgweGM3NmM1MWEzLCAweDA2NTRiZTMwKSxcblx0Z2V0NjQoMHhkMTkyZTgxOSwgMHhkNmVmNTIxOCksIGdldDY0KDB4ZDY5OTA2MjQsIDB4NTU2NWE5MTApLCBnZXQ2NCgweGY0MGUzNTg1LCAweDU3NzEyMDJhKSwgZ2V0NjQoMHgxMDZhYTA3MCwgMHgzMmJiZDFiOCksXG5cdGdldDY0KDB4MTlhNGMxMTYsIDB4YjhkMmQwYzgpLCBnZXQ2NCgweDFlMzc2YzA4LCAweDUxNDFhYjUzKSwgZ2V0NjQoMHgyNzQ4Nzc0YywgMHhkZjhlZWI5OSksIGdldDY0KDB4MzRiMGJjYjUsIDB4ZTE5YjQ4YTgpLFxuXHRnZXQ2NCgweDM5MWMwY2IzLCAweGM1Yzk1YTYzKSwgZ2V0NjQoMHg0ZWQ4YWE0YSwgMHhlMzQxOGFjYiksIGdldDY0KDB4NWI5Y2NhNGYsIDB4Nzc2M2UzNzMpLCBnZXQ2NCgweDY4MmU2ZmYzLCAweGQ2YjJiOGEzKSxcblx0Z2V0NjQoMHg3NDhmODJlZSwgMHg1ZGVmYjJmYyksIGdldDY0KDB4NzhhNTYzNmYsIDB4NDMxNzJmNjApLCBnZXQ2NCgweDg0Yzg3ODE0LCAweGExZjBhYjcyKSwgZ2V0NjQoMHg4Y2M3MDIwOCwgMHgxYTY0MzllYyksXG5cdGdldDY0KDB4OTBiZWZmZmEsIDB4MjM2MzFlMjgpLCBnZXQ2NCgweGE0NTA2Y2ViLCAweGRlODJiZGU5KSwgZ2V0NjQoMHhiZWY5YTNmNywgMHhiMmM2NzkxNSksIGdldDY0KDB4YzY3MTc4ZjIsIDB4ZTM3MjUzMmIpLFxuXHRnZXQ2NCgweGNhMjczZWNlLCAweGVhMjY2MTljKSwgZ2V0NjQoMHhkMTg2YjhjNywgMHgyMWMwYzIwNyksIGdldDY0KDB4ZWFkYTdkZDYsIDB4Y2RlMGViMWUpLCBnZXQ2NCgweGY1N2Q0ZjdmLCAweGVlNmVkMTc4KSxcblx0Z2V0NjQoMHgwNmYwNjdhYSwgMHg3MjE3NmZiYSksIGdldDY0KDB4MGE2MzdkYzUsIDB4YTJjODk4YTYpLCBnZXQ2NCgweDExM2Y5ODA0LCAweGJlZjkwZGFlKSwgZ2V0NjQoMHgxYjcxMGIzNSwgMHgxMzFjNDcxYiksXG5cdGdldDY0KDB4MjhkYjc3ZjUsIDB4MjMwNDdkODQpLCBnZXQ2NCgweDMyY2FhYjdiLCAweDQwYzcyNDkzKSwgZ2V0NjQoMHgzYzllYmUwYSwgMHgxNWM5YmViYyksIGdldDY0KDB4NDMxZDY3YzQsIDB4OWMxMDBkNGMpLFxuXHRnZXQ2NCgweDRjYzVkNGJlLCAweGNiM2U0MmI2KSwgZ2V0NjQoMHg1OTdmMjk5YywgMHhmYzY1N2UyYSksIGdldDY0KDB4NWZjYjZmYWIsIDB4M2FkNmZhZWMpLCBnZXQ2NCgweDZjNDQxOThjLCAweDRhNDc1ODE3KSxcbl0gO1xuXG5mdW5jdGlvbiBjeWNsZSAoc3RhdGUsIHcpIHtcblxuXHQvLyBpbml0aWFsaXplIGhhc2ggdmFsdWUgZm9yIHRoaXMgY2h1bms6XG5cdGxldCBhID0gc3RhdGVbMF07XG5cdGxldCBiID0gc3RhdGVbMV07XG5cdGxldCBjID0gc3RhdGVbMl07XG5cdGxldCBkID0gc3RhdGVbM107XG5cdGxldCBlID0gc3RhdGVbNF07XG5cdGxldCBmID0gc3RhdGVbNV07XG5cdGxldCBnID0gc3RhdGVbNl07XG5cdGxldCBoID0gc3RhdGVbN107XG5cblx0Ly8gTWFpbiBsb29wOlxuXHQvLyBmb3IgaiBmcm9tIDAgdG8gNzlcblx0Zm9yIChsZXQgaiA9IDA7IGogPCA4MDsgKytqKSB7XG5cdFx0Ly8gUzEgOj0gKGUgcmlnaHRyb3RhdGUgMTQpIHhvciAoZSByaWdodHJvdGF0ZSAxOCkgeG9yIChlIHJpZ2h0cm90YXRlIDQxKVxuXHRcdGNvbnN0IHMxID0geG9yNjQoeG9yNjQocm90cjY0KGUsIDE0KSwgcm90cjY0KGUsIDE4KSksIHJvdHI2NChlLCA0MSkpO1xuXHRcdC8vIGNoIDo9IChlIGFuZCBmKSB4b3IgKChub3QgZSkgYW5kIGcpXG5cdFx0Y29uc3QgY2ggPSB4b3I2NChhbmQ2NChlLCBmKSwgYW5kNjQobm90NjQoZSksIGcpKTtcblx0XHQvLyB0ZW1wIDo9IGggKyBTMSArIGNoICsga1tqXSArIHdbal1cblx0XHRsZXQgdGVtcCA9IGFkZDY0KGFkZDY0KGgsIHMxKSwgYWRkNjQoYWRkNjQoY2gsIGtbal0pLCB3W2pdKSk7XG5cdFx0Ly8gZCA6PSBkICsgdGVtcDtcblx0XHRkID0gYWRkNjQoZCwgdGVtcCk7XG5cdFx0Ly8gUzAgOj0gKGEgcmlnaHRyb3RhdGUgMjgpIHhvciAoYSByaWdodHJvdGF0ZSAzNCkgeG9yIChhIHJpZ2h0cm90YXRlIDM5KVxuXHRcdGNvbnN0IHMwID0geG9yNjQoeG9yNjQocm90cjY0KGEsIDI4KSwgcm90cjY0KGEsIDM0KSksIHJvdHI2NChhLCAzOSkpO1xuXHRcdC8vIG1haiA6PSAoYSBhbmQgKGIgeG9yIGMpKSB4b3IgKGIgYW5kIGMpXG5cdFx0Y29uc3QgbWFqID0geG9yNjQoYW5kNjQoYSwgeG9yNjQoYiwgYykpLCBhbmQ2NChiLCBjKSk7XG5cdFx0Ly8gdGVtcCA6PSB0ZW1wICsgUzAgKyBtYWpcblx0XHR0ZW1wID0gYWRkNjQoYWRkNjQodGVtcCwgczApLCBtYWopO1xuXG5cdFx0aCA9IGc7XG5cdFx0ZyA9IGY7XG5cdFx0ZiA9IGU7XG5cdFx0ZSA9IGQ7XG5cdFx0ZCA9IGM7XG5cdFx0YyA9IGI7XG5cdFx0YiA9IGE7XG5cdFx0YSA9IHRlbXA7XG5cdH1cblxuXHQvLyBBZGQgdGhpcyBjaHVuaydzIGhhc2ggdG8gcmVzdWx0IHNvIGZhcjpcblx0c3RhdGVbMF0gPSBhZGQ2NChzdGF0ZVswXSwgYSk7XG5cdHN0YXRlWzFdID0gYWRkNjQoc3RhdGVbMV0sIGIpO1xuXHRzdGF0ZVsyXSA9IGFkZDY0KHN0YXRlWzJdLCBjKTtcblx0c3RhdGVbM10gPSBhZGQ2NChzdGF0ZVszXSwgZCk7XG5cdHN0YXRlWzRdID0gYWRkNjQoc3RhdGVbNF0sIGUpO1xuXHRzdGF0ZVs1XSA9IGFkZDY0KHN0YXRlWzVdLCBmKTtcblx0c3RhdGVbNl0gPSBhZGQ2NChzdGF0ZVs2XSwgZyk7XG5cdHN0YXRlWzddID0gYWRkNjQoc3RhdGVbN10sIGgpO1xufVxuXG5mdW5jdGlvbiBjYWxsIChoLCBkYXRhLCBvKSB7XG5cblx0Y29uc3QgdyA9IG5ldyBBcnJheSg4MCk7XG5cblx0Ly8gYnJlYWsgY2h1bmsgaW50byBzaXh0ZWVuIDY0LWJpdCBiaWctZW5kaWFuIHdvcmRzIHdbaV0sIDAg4omkIGkg4omkIDE1XG5cdGZvciAobGV0IGogPSAwOyBqIDwgMTY7ICsraikge1xuXHRcdHdbal0gPSBiaWc2NChkYXRhLCBvICsgaiAqIDgpO1xuXHR9XG5cblx0Ly8gRXh0ZW5kIHRoZSBzaXh0ZWVuIDY0LWJpdCB3b3JkcyBpbnRvIDgwIDY0LWJpdCB3b3Jkczpcblx0Ly8gZm9yIGogZnJvbSAxNiB0byA3OVxuXHRmb3IgKGxldCBqID0gMTY7IGogPCA4MDsgKytqKSB7XG5cdFx0Ly8gczAgOj0gKHdbai0xNV0gcmlnaHRyb3RhdGUgMSkgeG9yICh3W2otMTVdIHJpZ2h0cm90YXRlIDgpIHhvciAod1tqLTE1XSByaWdodHNoaWZ0IDcpXG5cdFx0Y29uc3QgczAgPSB4b3I2NCh4b3I2NChyb3RyNjQod1tqLTE1XSwgIDEpLCByb3RyNjQod1tqLTE1XSwgIDgpKSwgc2hyNjQod1tqLTE1XSwgNykpO1xuXHRcdC8vIHMxIDo9ICh3W2otMl0gcmlnaHRyb3RhdGUgMTkpIHhvciAod1tqLTJdIHJpZ2h0cm90YXRlIDYxKSB4b3IgKHdbai0yXSByaWdodHNoaWZ0IDYpXG5cdFx0Y29uc3QgczEgPSB4b3I2NCh4b3I2NChyb3RyNjQod1tqLSAyXSwgMTkpLCByb3RyNjQod1tqLSAyXSwgNjEpKSwgc2hyNjQod1tqLSAyXSwgNikpO1xuXHRcdC8vIHdbal0gOj0gd1tqLTE2XSArIHMwICsgd1tqLTddICsgczFcblx0XHR3W2pdID0gYWRkNjQoYWRkNjQod1tqLTE2XSwgczApLCBhZGQ2NCh3W2otN10sIHMxKSk7XG5cdH1cblxuXHRjeWNsZShoLCB3KTtcblxufVxuXG5cbi8qKlxuICogU0hBLTUxMlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhNTEyIChieXRlcywgbiwgZGlnZXN0KSB7XG5cblx0Ly8gTm90ZSAxOiBBbGwgdmFyaWFibGVzIGFyZSB1bnNpZ25lZCA2NCBiaXRzIGFuZCB3cmFwIG1vZHVsbyAyXjY0IHdoZW4gY2FsY3VsYXRpbmdcblx0Ly8gTm90ZSAyOiBBbGwgY29uc3RhbnRzIGluIHRoaXMgcHNldWRvIGNvZGUgYXJlIGJpZyBlbmRpYW5cblxuXHQvLyBJbml0aWFsaXplIHZhcmlhYmxlc1xuXHQvLyAoZmlyc3QgNjQgYml0cyBvZiB0aGUgZnJhY3Rpb25hbCBwYXJ0cyBvZiB0aGUgc3F1YXJlIHJvb3RzIG9mIHRoZSBmaXJzdCA4IHByaW1lcyAyLi4xOSk6XG5cdGNvbnN0IGggPSBbXG5cdFx0Z2V0NjQoMHg2YTA5ZTY2NywgMHhmM2JjYzkwOCksXG5cdFx0Z2V0NjQoMHhiYjY3YWU4NSwgMHg4NGNhYTczYiksXG5cdFx0Z2V0NjQoMHgzYzZlZjM3MiwgMHhmZTk0ZjgyYiksXG5cdFx0Z2V0NjQoMHhhNTRmZjUzYSwgMHg1ZjFkMzZmMSksXG5cdFx0Z2V0NjQoMHg1MTBlNTI3ZiwgMHhhZGU2ODJkMSksXG5cdFx0Z2V0NjQoMHg5YjA1Njg4YywgMHgyYjNlNmMxZiksXG5cdFx0Z2V0NjQoMHgxZjgzZDlhYiwgMHhmYjQxYmQ2YiksXG5cdFx0Z2V0NjQoMHg1YmUwY2QxOSwgMHgxMzdlMjE3OSksXG5cdF0gO1xuXG5cdC8vIFBSRVBBUkVcblxuXHRjb25zdCBxID0gbiAvIDggfCAwO1xuXHRjb25zdCB6ID0gcSAqIDg7XG5cdGNvbnN0IHUgPSBuIC0gejtcblxuXHQvLyBhcHBlbmQgdGhlIGJpdCAnMScgdG8gdGhlIG1lc3NhZ2Vcblx0bGV0IGxhc3QgO1xuXHRpZiAodSA+IDApIHtcblx0XHRsYXN0ID0gYnl0ZXNbcV0gJiAofjApIDw8ICg3LXUpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGxhc3QgPSAweDgwO1xuXHR9XG5cblxuXHQvLyBQcm9jZXNzIHRoZSBtZXNzYWdlIGluIHN1Y2Nlc3NpdmUgMTAyNC1iaXQgY2h1bmtzOlxuXHQvLyBicmVhayBtZXNzYWdlIGludG8gMTAyNC1iaXQgY2h1bmtzXG5cblx0Y29uc3QgbSA9IG4gLyAxMDI0IHwgMDtcblx0Y29uc3QgeSA9IChuIC0gMTAyNCAqIG0pIC8gOCB8IDA7XG5cblx0Ly8gb2Zmc2V0IGluIGRhdGFcblx0bGV0IG8gPSAwO1xuXG5cdC8vIGZvciBlYWNoIGNodW5rXG5cdGZvciAobGV0IGogPSAwOyBqIDwgbTsgKytqLCBvICs9IDEyOCkge1xuXHRcdGNhbGwoaCwgYnl0ZXMsIG8pO1xuXHR9XG5cblx0Ly8gbGFzdCBieXRlcyArIHBhZGRpbmcgKyBsZW5ndGhcblx0bGV0IHRhaWwgPSBbXTtcblxuXHQvLyBsYXN0IGJ5dGVzXG5cdGZvciAobGV0IGogPSAwOyBqIDwgeTsgKytqKSB7XG5cdFx0dGFpbC5wdXNoKGJ5dGVzW28gKyBqXSk7XG5cdH1cblxuXHQvLyBzcGVjaWFsIGNhcmUgdGFrZW4gZm9yIHRoZSB2ZXJ5IGxhc3QgYnl0ZSB3aGljaCBjb3VsZFxuXHQvLyBoYXZlIGJlZW4gbW9kaWZpZWQgaWYgbiBpcyBub3QgYSBtdWx0aXBsZSBvZiA4XG5cdHRhaWwucHVzaChsYXN0KTtcblxuXG5cdC8vIGFwcGVuZCAwIOKJpCBrIDwgMTAyNCBiaXRzICcwJywgc28gdGhhdCB0aGUgcmVzdWx0aW5nXG5cdC8vIG1lc3NhZ2UgbGVuZ3RoIChpbiBiaXRzKSBpcyBjb25ncnVlbnQgdG8gODk2IChtb2QgMTAyNClcblx0Y29uc3QgZyA9ICg4OTYgLSAobiArIDEpICUgMTAyNCk7XG5cdGxldCB6ZXJvZXMgPSBnIC8gOCB8IDA7XG5cblx0aWYgKGcgPCAwKSB7XG5cdFx0Ly8gd2UgbmVlZCBhbiBhZGRpdGlvbmFsIGJsb2NrIGFzIHRoZXJlIGlzXG5cdFx0Ly8gbm90IGVub3VnaCBzcGFjZSBsZWZ0IHRvIGFwcGVuZFxuXHRcdC8vIHRoZSBsZW5ndGggb2YgdGhlIGRhdGEgaW4gYml0c1xuXG5cdFx0Zm9yIChsZXQgaiA9IDA7IGogPCAtemVyb2VzOyArK2opIHtcblx0XHRcdHRhaWwucHVzaCgwKTtcblx0XHR9XG5cblx0XHRjYWxsKGgsIHRhaWwsIDApO1xuXG5cdFx0emVyb2VzID0gODk2IC8gODtcblx0XHR0YWlsID0gW107XG5cdH1cblxuXG5cdC8vIHBhZCB3aXRoIHplcm9lc1xuXHRmb3IgKGxldCBqID0gMDsgaiA8IHplcm9lczsgKytqKSB7XG5cdFx0dGFpbC5wdXNoKDApO1xuXHR9XG5cblx0Ly8gYXBwZW5kIGxlbmd0aCBvZiBtZXNzYWdlIChiZWZvcmUgcHJlcGFyYXRpb24pLCBpbiBiaXRzLFxuXHQvLyBhcyAxMjgtYml0IGJpZy1lbmRpYW4gaW50ZWdlclxuXG5cdC8vIEphdmFTY3JpcHQgd29ya3Mgd2l0aCAzMiBiaXQgaW50ZWdlcnMuXG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gMTI0KSAmIDB4ZmYpO1xuXHQvLyB0YWlsLnB1c2goKG4gPj4+IDExNikgJiAweGZmKTtcblx0Ly8gdGFpbC5wdXNoKChuID4+PiAxMDgpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gOTYpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gODgpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gODApICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNzIpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNjQpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNTYpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNDgpICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gNDApICYgMHhmZik7XG5cdC8vIHRhaWwucHVzaCgobiA+Pj4gMzIpICYgMHhmZik7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cdHRhaWwucHVzaCgwKTtcblx0dGFpbC5wdXNoKDApO1xuXHR0YWlsLnB1c2goMCk7XG5cblx0dGFpbC5wdXNoKChuID4+PiAyNCkgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAxNikgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAgOCkgJiAweGZmKTtcblx0dGFpbC5wdXNoKChuID4+PiAgMCkgJiAweGZmKTtcblxuXHRjYWxsKGgsIHRhaWwsIDApO1xuXG5cdGZvciAobGV0IGkgPSAwLCBqID0gMDsgaiA8IDg7ICsraikge1xuXHRcdGRpZ2VzdFtpXSA9IChoW2pdWzBdID4+PiAyNCkgJiAweGZmO1xuXHRcdCsraTtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVswXSA+Pj4gMTYpICYgMHhmZjtcblx0XHQrK2k7XG5cdFx0ZGlnZXN0W2ldID0gKGhbal1bMF0gPj4+ICA4KSAmIDB4ZmY7XG5cdFx0KytpO1xuXHRcdGRpZ2VzdFtpXSA9IChoW2pdWzBdID4+PiAgMCkgJiAweGZmO1xuXHRcdCsraTtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVsxXSA+Pj4gMjQpICYgMHhmZjtcblx0XHQrK2k7XG5cdFx0ZGlnZXN0W2ldID0gKGhbal1bMV0gPj4+IDE2KSAmIDB4ZmY7XG5cdFx0KytpO1xuXHRcdGRpZ2VzdFtpXSA9IChoW2pdWzFdID4+PiAgOCkgJiAweGZmO1xuXHRcdCsraTtcblx0XHRkaWdlc3RbaV0gPSAoaFtqXVsxXSA+Pj4gIDApICYgMHhmZjtcblx0XHQrK2k7XG5cdH1cblxuXHRyZXR1cm4gZGlnZXN0O1xuXG59XG4iXX0=