// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WalletContract {
	uint256 private constant MIN = 10000000000000000; // 0.01 
	address private constant HOT_WALLET = 0xF59a05dE072371e7bd4d072f5Df2a0048d994486;


	event DepositedOnMetaDapp();

	function forward() private {
		if(msg.value >= MIN) {
			(bool success, ) = payable(HOT_WALLET).call{value: address(this).balance}("");
			require(success);
			emit DepositedOnMetaDapp();
		}
	}

	receive() external payable { forward(); }
	fallback() external payable { forward(); }
}