import mongoose  from 'mongoose';
import ESXPlayer from '../../../../server/player';

export const name = 'rp.base';

export default class testing {

  constructor(esx) {

  }

  init(esx) {

    return new Promise(async (resolve, reject) => {

      /* Models */
      esx.modules.db.model('RPUser', {
        identifiers: [String],
        identities : { type: [mongoose.Schema.Types.ObjectId], ref: 'RPIdentity' }
      }, class {
        
      });

      esx.modules.db.model('RPIdentity', {
        firstName: String,
        lastName : String,
      }, class {
        
      });

      /* Extend base classes */
      ESXPlayer.prototype.init = function() {
        
        return new Promise(async (resolve, reject) => {

          const identifiers     = this.getIdentifiers();
          const query           = {identifiers: {$in: identifiers}};
    
          let rpUser = await esx.modules.db.model('RPUser').findOne(query).populate('RPIdentity').exec();

          if(!rpUser) {
            esx.log(`[esx:rp] create user for ${this.name}`);
            rpUser = await esx.modules.db.model('RPUser').create({identifiers});
          } else {
            esx.log(`[esx:rp] loaded user for ${this.name}`);
          }

          esx.log(`[esx:rp] updating user identifiers for ${this.name}`);

          for(let i=0; i<identifiers.length; i++) {

            const type = identifiers[i].split(':')[0];
            const idx  = rpUser.identifiers.findIndex(e => e.split(':')[0] === type);

            if(idx !== -1)
              rpUser.identifiers[idx] = identifiers[i];
            else
              rpUser.identifiers.push(identifiers[i]);

          }

          rpUser.markModified('identifiers');

          await rpUser.save();

          this.rpUser = rpUser;

          resolve();

        });

      }

      ESXPlayer.prototype.save = function() {
        return this.rpUser.save();
      }

      /* Events */

      esx.on('player.connect', async (player) => {
        esx.log(`[esx:rp] init player ${player.name}`);
        await player.init();
        esx.emit('rp.player.init', player);
      });

      esx.on('player.disconnect', async (player) => {
        esx.log(`[esx:rp] save player ${player.name}`);
        await player.save();
      });

      resolve(this);
    });

  }

};