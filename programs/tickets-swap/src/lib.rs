use anchor_lang::prelude::*;

declare_id!("9Pjw3S522y2xavPFvmZ1pSHU8akopTzXCdCY3iY9eRAA");

#[program]
pub mod tickets_swap {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
