"use strict";

var memory = new Uint8Array(4096);
// 0
memory[0x000] = 0xF0;
memory[0x001] = 0x90;
memory[0x002] = 0x90;
memory[0x003] = 0x90;
memory[0x004] = 0xF0;
// 1
memory[0x005] = 0x20;
memory[0x006] = 0x60;
memory[0x007] = 0x20;
memory[0x008] = 0x20;
memory[0x009] = 0x70;
// 2
memory[0x00A] = 0xF0;
memory[0x00B] = 0x10;
memory[0x00C] = 0xF0;
memory[0x00D] = 0x80;
memory[0x00E] = 0xF0;
// 3
memory[0x00F] = 0xF0;
memory[0x010] = 0x10;
memory[0x011] = 0xF0;
memory[0x012] = 0x10;
memory[0x013] = 0xF0;
// 4
memory[0x014] = 0x90;
memory[0x015] = 0x90;
memory[0x016] = 0xF0;
memory[0x017] = 0x10;
memory[0x018] = 0x10;
// 5
memory[0x019] = 0xF0;
memory[0x01A] = 0x80;
memory[0x01B] = 0xF0;
memory[0x01C] = 0x10;
memory[0x01D] = 0xF0;
// 6
memory[0x01E] = 0xF0;
memory[0x01F] = 0x80;
memory[0x020] = 0xF0;
memory[0x021] = 0x90;
memory[0x022] = 0xF0;
// 7
memory[0x023] = 0xF0;
memory[0x024] = 0x10;
memory[0x025] = 0x20;
memory[0x026] = 0x40;
memory[0x027] = 0x40;
// 8
memory[0x028] = 0xF0;
memory[0x029] = 0x90;
memory[0x02A] = 0xF0;
memory[0x02B] = 0x90;
memory[0x02C] = 0xF0;
// 9
memory[0x02D] = 0xF0;
memory[0x02E] = 0x90;
memory[0x02F] = 0xF0;
memory[0x030] = 0x10;
memory[0x031] = 0xF0;
// A
memory[0x032] = 0xF0;
memory[0x033] = 0x90;
memory[0x034] = 0xF0;
memory[0x035] = 0x90;
memory[0x036] = 0x90;
// B
memory[0x037] = 0xE0;
memory[0x038] = 0x90;
memory[0x039] = 0xE0;
memory[0x03A] = 0x90;
memory[0x03B] = 0xE0;
// C
memory[0x03C] = 0xF0;
memory[0x03D] = 0x80;
memory[0x03E] = 0x80;
memory[0x03F] = 0x80;
memory[0x040] = 0xF0;
// D
memory[0x041] = 0xE0;
memory[0x042] = 0x90;
memory[0x043] = 0x90;
memory[0x044] = 0x90;
memory[0x045] = 0xE0;
// E
memory[0x046] = 0xF0;
memory[0x047] = 0x80;
memory[0x048] = 0xF0;
memory[0x049] = 0x80;
memory[0x04A] = 0xF0;
// F
memory[0x04B] = 0xF0;
memory[0x04C] = 0x80;
memory[0x04D] = 0xF0;
memory[0x04E] = 0x80;
memory[0x04F] = 0x80;

// Tone Test
memory[0x200] = 0xF0;
memory[0x201] = 0x0A;
memory[0x202] = 0x60;
memory[0x203] = 0x8F;
memory[0x204] = 0xF0;
memory[0x205] = 0x18;
memory[0x206] = 0x12;
memory[0x207] = 0x00;

var registers = {
	PC: 0x0200,	// 16-bit register
	I : 0x0000,	// 16-bit register
	SP: 0x00,	//  8-bit register
	DT: 0x00,	//  8-bit register
	ST: 0x00,	//  8-bit register
	V0: 0x00,	//  8-bit register
	V1: 0x00,	//  8-bit register
	V2: 0x00,	//  8-bit register
	V3: 0x00,	//  8-bit register
	V4: 0x00,	//  8-bit register
	V5: 0x00,	//  8-bit register
	V6: 0x00,	//  8-bit register
	V7: 0x00,	//  8-bit register
	V8: 0x00,	//  8-bit register
	V9: 0x00,	//  8-bit register
	VA: 0x00,	//  8-bit register
	VB: 0x00,	//  8-bit register
	VC: 0x00,	//  8-bit register
	VD: 0x00,	//  8-bit register
	VE: 0x00,	//  8-bit register
	VF: 0x00	//  8-bit register
};

var stack = new Uint16Array(16);

var key = {};
for (let i = 0x0; i < 0xFF; i++)
	key[i] = false;
var keyBuffer = null;
const keyMap = {
	49: 0x1,	// 1
	50: 0x2,	// 2
	51: 0x3,	// 3
	52: 0xC,	// 4
	81: 0x4,	// Q
	87: 0x5,	// W
	69: 0x6,	// E
	82: 0xD,	// R
	65: 0x7,	// A
	83: 0x8,	// S
	68: 0x9,	// D
	70: 0xE,	// F
	90: 0xA,	// Z
	88: 0x0,	// X
	67: 0xB,	// C
	86: 0xF		// V
};

const audioContext = new AudioContext()
var buzzer;
var audioPlaying = false;

const screenCanvas = document.getElementsByTagName("canvas")[0].getContext("2d");
const screenWidth = 64;
const screenHeight = 32;

var screen = [];
for (let x = 0; x < screenWidth; x++) {
	screen[x] = [];
	for (let y = 0; y < screenHeight; y++)
		screen[x][y] = 0;
}

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", start, true);

const programInput = document.getElementById("programInput");
programInput.addEventListener("change", readFile, false);

function start()
{
	startButton.removeEventListener("click", start, true);
	startButton.disabled = true;
	programInput.removeEventListener("change", readFile, false);
	programInput.disabled = true;
	cycle();
}

function cycle()
{
	soundTimer();
	delayTimer();

	let inst1 = memory[registers.PC++];
	let inst2 = memory[registers.PC++];
	let inst = (inst1 << 8) | inst2;
	doInstruction(inst);

	requestAnimationFrame(cycle);
}

async function doInstruction(instr)
{
	let x, y, n, kk, nnn, result;
	switch (true) {
	// 00E0 - CLS
	case (instr == 0x00E0):
		screenCanvas.clearRect(0, 0, screenWidth, screenHeight);
		break;
	// 00EE - RET
	case (instr == 0x00EE):
		registers.PC = stack[registers.SP--];
		break;
	// 1nnn - JP addr
	case ((instr & 0xF000) == 0x1000):
		nnn = (instr & 0x0FFF);
		registers.PC = nnn;
		break;
	// 2nnn - CALL addr
	case ((instr & 0xF000) == 0x2000):
		nnn = (instr & 0x0FFF);
		registers.SP++;
		stack[registers.SP] = registers.PC;
		registers.PC = nnn;
		break;
	// 3xkk - SE Vx, byte
	case ((instr & 0xF000) == 0x3000):
		x = (instr & 0x0F00) >> 8;
		kk = (instr & 0x00FF);
		if (registers[`V${x}`] == kk)
			registers.PC += 2;
		break;
	// 4xkk - SNE Vx, byte
	case ((instr & 0xF000) == 0x4000):
		x = (instr & 0x0F00) >> 8;
		kk = (instr & 0x00FF);
		if (registers[`V${x}`] != kk)
			registers.PC += 2;
		break;
	// 5xy0 - SE Vx, Vy
	case ((instr & 0xF000) == 0x5000):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		if (registers[`V${x}`] == registers[`V${y}`])
			registers.PC += 2;
		break;
	// 6xkk - LD Vx, byte
	case ((instr & 0xF000) == 0x6000):
		x = (instr & 0x0F00) >> 8;
		kk = (instr & 0x00FF);
		registers[`V${x}`] = kk;
		break;
	// 7xkk - ADD Vx, byte
	case ((instr & 0xF000) == 0x7000):
		x = (instr & 0x0F00) >> 8;
		kk = (instr & 0x00FF);
		registers[`V${x}`] += kk;
		break;
	// 8xy0 - LD Vx, Vy
	case ((instr & 0xF00F) == 0x8000):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		registers[`V${x}`] = registers[`V${y}`];
		break;
	// 8xy1 - OR Vx, Vy
	case ((instr & 0xF00F) == 0x8001):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		registers[`V${x}`] = registers[`V${x}`] | registers[`V${y}`];
		break;
	// 8xy2 - AND Vx, Vy
	case ((instr & 0xF00F) == 0x8002):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		registers[`V${x}`] = registers[`V${x}`] & registers[`V${y}`];
		break;
	// 8xy3 - XOR Vx, Vy
	case ((instr & 0xF00F) == 0x8003):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		registers[`V${x}`] = registers[`V${x}`] ^ registers[`V${y}`];
		break;
	// 8xy4 - ADD Vx, Vy
	case ((instr & 0xF00F) == 0x8004):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		result = registers[`V${x}`] + registers[`V${y}`];
		registers.VF = (result > 0xFF) ? 1 : 0;
		registers[`V${x}`] = (result & 0xFF);
		break;
	// 8xy5 - SUB Vx, Vy
	case ((instr & 0xF00F) == 0x8005):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		result = registers[`V${x}`] - registers[`V${y}`];
		registers.VF = (registers[`V${x}`] > registers[`V${y}`]) ? 1 : 0;
		registers[`V${x}`] = result;
		break;
	// 8xy6 - SHR Vx {, Vy}
	case ((instr & 0xF00F) == 0x8006):
		x = (instr & 0x0F00) >> 8;
		//y = (instr & 0x00F0) >> 4;
		result = registers[`V${x}`] >> 1;
		registers.VF = ((registers[`V${x}`] & 0x01) === 1) ? 1 : 0;
		registers[`V${x}`] = result;
		break;
	// 8xy7 - SUBN Vx, Vy
	case ((instr & 0xF00F) == 0x8007):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		result = registers[`V${y}`] - registers[`V${x}`];
		registers.VF = (registers[`V${y}`] > registers[`V${x}`]) ? 1 : 0;
		registers[`V${x}`] = result;
		break;
	// 8xyE - SHL Vx {, Vy}
	case ((instr & 0xF00F) == 0x800E):
		x = (instr & 0x0F00) >> 8;
		//y = (instr & 0x00F0) >> 4;
		result = registers[`V${x}`] << 1;
		registers.VF = ((registers[`V${x}`] & 0x80) === 1) ? 1 : 0;
		registers[`V${x}`] = result;
		break;
	// 9xy0 - SNE Vx, Vy
	case ((instr & 0xF00F) == 0x0000):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		if (registers[`V${x}`] != registers[`V${y}`])
			registers.PC += 2;
		break;
	// Annn - LD I, addr
	case ((instr & 0xF000) == 0xA000):
		nnn = (instr & 0x0FFF);
		registers.I = nnn;
		break;
	// Bnnn - JP V0, addr
	case ((instr & 0xF000) == 0xB000):
		nnn = (instr & 0x0FFF);
		registers.PC = nnn + registers.V0;
		break;
	// Cxkk - RND Vx, byte
	case ((instr & 0xF000) == 0xC000):
		x = (instr & 0x0F00) >> 8;
		kk = (instr & 0x00FF);
		result = (randInt(0, 255) & kk);
		registers[`V${x}`] = result;
		break;
	// Dxyn - DRW Vx, Vy, nibble
	case ((instr & 0xF000) == 0xD000):
		x = (instr & 0x0F00) >> 8;
		y = (instr & 0x00F0) >> 4;
		n = (instr & 0x000F);
		for (let i = 0; i < n; i++) {
			let sprite = memory[registers.I + i];
			for (let j = 0; j < 8; j++) {
				let _x = registers[`V${x}`] + j;
				let _y = registers[`V${y}`] + i;
				while (_x >= screenWidth)
					_x -= screenWidth;
				while (_y >= screenHeight)
					_y -= screenHeight;
				let spriteBit = (sprite >> 7 - j) & 0x1
				let screenBit = screen[_x][_y];
				let resultBit = spriteBit ^ screenBit;
				if (resultBit < screenBit)
					registers.VF = 1;
				screen[_x][_y] = resultBit;
				screenCanvas.fillStyle = resultBit === 1 ? "black" : "white";
				screenCanvas.fillRect(_x, _y, 1, 1);
			}
		}
		break;
	// Ex9E - SKP Vx
	case ((instr & 0xF0FF) == 0xE09E):
		x = (instr & 0x0F00) >> 8;
		if (key[registers[`V${x}`]])
			registers.PC += 2;
		break;
	// ExA1 - SKNP Vx
	case ((instr & 0xF0FF) == 0xE0A1):
		x = (instr & 0x0F00) >> 8;
		if (!key[registers[`V${x}`]])
			registers.PC += 2;
		break;
	// Fx07 - LD Vx, DT
	case ((instr & 0xF0FF) == 0xF007):
		x = (instr & 0x0F00) >> 8;
		registers[`V${x}`] = registers.DT;
		break;
	// Fx0A - LD Vx, K
	case ((instr & 0xF0FF) == 0xF00A):
		x = (instr & 0x0F00) >> 8;
		keyBuffer = null;
		while (keyBuffer === null)
			await sleep(5);
		registers[`V${x}`] = keyBuffer;
		break;
	// Fx15 - LD DT, Vx
	case ((instr & 0xF0FF) == 0xF015):
		x = (instr & 0x0F00) >> 8;
		registers.DT = registers[`V${x}`];
		break;
	// Fx18 - ADD I, Vx
	case ((instr & 0xF0FF) == 0xF018):
		x = (instr & 0x0F00) >> 8;
		registers.ST = registers[`V${x}`];
		break;
	// Fx1E - ADD I, Vx
	case ((instr & 0xF0FF) == 0xF01E):
		x = (instr & 0x0F00) >> 8;
		registers.I += registers[`V${x}`];
		break;
	// Fx29 - LD F, Vx
	case ((instr & 0xF0FF) == 0xF029):
		x = (instr & 0x0F00) >> 8;
		registers.I = registers[`V${x}`] * 5;
		break;
	// Fx33 - LD B, Vx
	case ((instr & 0xF0FF) == 0xF033):
		x = (instr & 0x0F00) >> 8;
		memory[registers.I] = Math.floor(registers[`V${x}`] / 100);
		memory[registers.I+2] = registers[`V${x}`] - (Math.floor(registers[`V${x}`] / 10) * 10);
		memory[registers.I+1] = registers[`V${x}`] - memory[registers.I] - (memory[registers.I+2]);
		break;
	// Fx55 - LD [I], Vx
	case ((instr & 0xF0FF) == 0xF055):
		x = (instr & 0x0F00) >> 8;
		for (let i = 0; i <= x; i++)
			memory[registers.I + i] = registers[`V${i}`];
		break;
	// Fx65 - LD Vx, [I]
	case ((instr & 0xF0FF) == 0xF065):
		x = (instr & 0x0F00) >> 8;
		for (let i = 0; i <= x; i++)
			registers[`V${i}`] = memory[registers.I + i];
		break;
	default:
		console.log(`INVALID INSTRUCTION: 0x${instr.toString(16)}`);
	}
}

function delayTimer()
{
	if (registers.DT > 0)
		registers.DT--;
}

function soundTimer()
{
	if (registers.ST-- > 0 && !audioPlaying) {
		audioPlaying = true;
		buzzer = audioContext.createOscillator();
		buzzer.type = "sine";
		buzzer.connect(audioContext.destination);
		buzzer.start();
	} else if (audioPlaying) {
		audioPlaying = false;
		buzzer.stop();
	}
}

function randInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

function onKeyDown(e)
{
	let keyCode = e.which;
	if (keyMap.hasOwnProperty(keyCode)) {
		e.preventDefault();
		key[keyMap[keyCode]] = true;
		if (!e.repeat)
			keyBuffer = keyMap[keyCode];
	}
}

function onKeyUp(e)
{
	let keyCode = e.which;
	if (keyMap.hasOwnProperty(keyCode)) {
		e.preventDefault();
		key[keyMap[keyCode]] = true;
	}
}

function readFile(e)
{
	let file = e.target.files[0];
	if (!file)
		return;
	let reader = new FileReader();
	reader.onload = readProgram;
	reader.readAsArrayBuffer(file);
}

function readProgram(e) 
{
	let program = new Uint8Array(e.target.result);
	for (let i = 0x0; i < program.byteLength; i++)
		memory[0x200+i] = program[i];
}
