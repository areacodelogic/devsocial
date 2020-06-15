const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const authorize = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    GET current Users profile
// @access  private

router.get('/me', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Creat or update user profile
// @access  private

router.post(
  '/',
  [
    authorize,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      Array.isArray(skills)
        ? skills
        : (profileFields.skills = skills
          .split(",")
          .map((skill) => " " + skill.trim()))
      // @BUG FIX
      // profileFields.skills = skills.split(',').map((skill) => " " + skill.trim());
    }

    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   Get api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    DELETE profile, user & posts
// @access  Private
router.delete('/', authorize, async (req, res) => {
  try {
    // @todo remove users posts

    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove User
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/experience
// @desc    ADD profile experience
// @access  Private

router.put(
  '/experience',
  [
    authorize,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

   

    try {
      const profile = await Profile.findOne({ user: req.user.id });
     

      profile.experience.unshift(newExp);
      
      console.log(profile)

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/profile/experience/:exp_id
// @desc    Edit profile experience
// @access  Private

// router.put(
//   '/experience/:exp_id',
//   [
//     authorize,
//     [
//       check('title', 'Title is required').not().isEmpty(),
//       check('company', 'Company is required').not().isEmpty(),
//       check('from', 'From Date is required').not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       let profile = await Profile.findOne({ user: req.user.id });
//       if (profile) {
//         profile = await Profile.findOneAndUpdate(
//           {
//             experience: { $elemMatch: { _id: req.params.exp_id } },
//           },
//           {
//             $set: {
//               'experience.$.current': req.body.current,
//               'experience.$.title': req.body.title,
//               'experience.$.company': req.body.company,
//               'experience.$.location': req.body.location,
//               'experience.$.from': req.body.from,
//               'experience.$.to': req.body.to,
//               'experience.$.description': req.body.description,
//             },
//           },
//           { new: true }
//         );
//       }
//       res.json(profile);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ msg: 'Server error' });
//     }
//   }
// );

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete('/experience/:exp_id', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/education
// @desc    ADD profile education
// @access  Private

router.put(
  '/education',
  [
    authorize,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/eduction/:edu_id
// @desc    Delete eduction from profile
// @access  Private

router.delete('/education/:edu_id', authorize, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Get api/profile/github/:username
// @desc    Get user repos from Github
// @access  public

router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

// @todo get the user to be able to update their experience

// @route   PUT api/profile/experience/:exp_id
// @desc    Edit profile experience
// @access  Private

// router.put(
//   '/experience/:exp_id',
//   [
//     authorize,
//     check('title', 'Title is required').not().isEmpty(),
//     check('company', 'Company is required').not().isEmpty(),
//     check('from', 'From date is required').not().isEmpty()
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { title, company, location, from, to, current, description } = req.body;
//     // since title, company, from are required
//     const exp = { title, company, from };
//     if (location) exp.location = location;
//     if (to) exp.to = to;
//     if (current) exp.current = current;
//     if (description) exp.description = description;

//     try {
//       const profile = await Profile.findOneAndUpdate(
//         { userid: req.user.id, 'experience._id': req.params.exp_id },
//         {
//           $set: {
//             // I don't want my experience id to change
//             'experience.$': { _id: req.params.exp_id, ...exp }
//           }
//         },
//         { new: true }
//       );

//       res.json(profile);
//     } catch (err) {
//       console.log(err.message);
//       res.status(500).send('Server Error');
//     }
//   }
// );

/** **/
