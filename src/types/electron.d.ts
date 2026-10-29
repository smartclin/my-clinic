/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Global type declarations for Electron Context Bridge APIs
 */

export interface DesktopBackupResult {
	success: boolean;
	filePath?: string;
	filename?: string;
	size?: number;
	timestamp?: string;
	sha256?: string;
	error?: string;
	log?: string;
}

export interface DesktopBackupItem {
	filename: string;
	filePath: string;
	size: number;
	createdAt: string;
}

export interface DesktopAppInfo {
	name: string;
	version: string;
	platform: string;
	arch: string;
	isPackaged: boolean;
	backupDir: string;
}

export interface ElectronBridgeAPI {
	isElectron: boolean;
	saveBackup: (
		jsonData: string,
		customName?: string
	) => Promise<DesktopBackupResult>;
	triggerExitBackup: (jsonData: string) => Promise<DesktopBackupResult>;
	getBackupDirectory: () => Promise<string>;
	listBackups: () => Promise<DesktopBackupItem[]>;
	openBackupFolder: () => Promise<boolean>;
	getAppInfo: () => Promise<DesktopAppInfo>;
	onExitBackupRequested: (
		callback: () => Promise<string> | string
	) => () => void;
	sendExitBackupComplete: (success: boolean) => void;
}

declare global {
	interface Window {
		electronAPI?: ElectronBridgeAPI;
	}
}
