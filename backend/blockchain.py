import hashlib
import json
import time

class Block:
    def __init__(self, index: int, timestamp: float, data: dict, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self._calculate_hash()

    def _calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash
        }, sort_keys=True, default=str)
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self._create_genesis_block()]

    def _create_genesis_block(self) -> Block:
        return Block(0, time.time(), {"message": "Genesis Block - Decentralized Academic Certificate System"}, "0")

    def get_latest_block(self) -> Block:
        return self.chain[-1]

    def add_block(self, data: dict) -> str:
        """Add new block and return its hash"""
        prev_block = self.get_latest_block()
        new_block = Block(
            index=len(self.chain),
            timestamp=time.time(),
            data=data,
            previous_hash=prev_block.hash
        )
        self.chain.append(new_block)
        return new_block.hash

    def is_valid_chain(self) -> bool:
        """Validate entire blockchain"""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i - 1]

            if current.hash != current._calculate_hash():
                return False
            if current.previous_hash != prev.hash:
                return False
        return True
